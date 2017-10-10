import React, {Component} from 'react';
import styled from 'styled-components';
import {RecentlyPlayed} from './RecentlyPlayed';
import {isExpired, Spotify} from '../../lib/spotify';
import {Dialog} from 'react-toolbox/lib/dialog';
import {SpotifyLoginButton} from '../SpotifyLoginButton';
import {CurrentPlayback} from './CurrentPlayback';
import autobind from 'autobind-decorator';
import {List, ListItem} from 'react-toolbox/lib/list';
import idx from 'idx';

import annyang from 'annyang';
import _ from 'lodash';

annyang.start({autoRestart: true, continuous: true});
annyang.debug(true);

export class MainApp extends Component {
    state = {
        activeDialog: false,
        currentPlayback: {}, // null will not set off componentwillreceiveprops
        recentlyPlayed: null,
        drawerActive: false,
        me: null
    };

    refreshId;
    tick;

    constructor(props) {
        super(props);
        this.refreshAll();
        const commandData = {
            'play *song by *artist': (song, artist) => {
                Spotify.search(song, ["track"], {artist}).then((song) => {
                    const songUri = idx(song, (x) => x.tracks.items[0].uri);
                    if (songUri) Spotify.play({uris: [songUri]}).then(this.refreshAll, this.checkExpired)
                }, this.checkExpired)
            },
            'play *song': (song) => {
                Spotify.search(song, ["track"]).then((song) => {
                    const songUri = idx(song, (x) => x.tracks.items[0].uri);
                    if (songUri) Spotify.play({uris: [songUri]}).then(this.refreshAll, this.checkExpired)
                }, this.checkExpired)
            },
            'resume': () => {
                this.setPlayState(true);
                Spotify.play({}).then(() => {}, this.checkExpired)
            },
            'pause': () => {
                this.setPlayState(false);
                Spotify.pause({}).then(() => {}, this.checkExpired)
            },
            'rewind': () => {
                Spotify.skipToPrevious({}).then(this.refreshAll, this.checkExpired);
            },
            'fast forward': () => {
                Spotify.skipToNext({}).then(this.refreshAll, this.checkExpired);
            }
        };
        const commands = _.mapKeys(commandData, (x, y) => {
            return 'spotify ' + y;
        });
        annyang.addCommands(commands);
    }

    setPlayState(playing) {
        this.setState((prev) => ({
            currentPlayback: {
                ...prev.currentPlayback,
                is_playing: playing
            }
        }));
    }

    componentDidMount() {
        this.refreshId = setInterval(this.refreshAll, 10000);
        Spotify.getMe().then((me) => {
            this.setState({
                me
            });
        });
        this.tick = setInterval(() => {
            this.setState((prev) => {
                if (idx(prev, (x) => x.currentPlayback.is_playing) && idx(prev, (x) => x.currentPlayback.progress_ms) < idx(prev, (x) => x.currentPlayback.item.duration_ms)) {
                    return {
                        ...prev,
                        currentPlayback: {...prev.currentPlayback, progress_ms: prev.currentPlayback.progress_ms + 1000}
                    };
                }
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.refreshId);
        clearInterval(this.tick);
    }

    @autobind
    refreshAll() {
        this.refreshRecentlyPlayed();
        this.refreshCurrentPlayback();
    }

    refreshRecentlyPlayed() {
        Spotify.getMyRecentlyPlayedTracks().then((data) => {
            this.setState({
                recentlyPlayed: data.items
            });
        }, this.checkExpired);
    }

    refreshCurrentPlayback() {
        Spotify.getMyCurrentPlayingTrack().then((data) => {
            this.setState({
                currentPlayback: data
            });
        }, this.checkExpired);
    }

    @autobind
    checkExpired(err) {
        if (isExpired(err)) {
            this.raiseRelogin();
        }
    }

    raiseRelogin() {
        this.setState({
            activeDialog: true
        });
    }

    render() {
        const Container = styled.div`display: flex; flex-direction: row`;

        const Base = styled.div`
            height: 100vh; 
            overflow-y: scroll; 
            ::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);background-color: #F5F5F5;}
            ::-webkit-scrollbar {width: 6px;background-color: #F5F5F5;}
            ::-webkit-scrollbar-thumb{background-color: #000000;}`;
        const Left = Base.extend`flex: 1`;
        const Middle = Base.extend`flex:3`;
        const Right = Base.extend`flex:1; height: 100vh; overflow-x: auto`;
        return (
            <Container>
                <Dialog active={this.state.activeDialog}
                        title='Your Spotify session has expired'>
                    <SpotifyLoginButton text="Login"/>
                </Dialog>
                <Left>
                    <List>
                        <ListItem leftIcon="info"
                                  selectable
                                  caption="About"/>
                        <ListItem leftIcon="settings" selectable
                                  caption="Settings"/>
                        <ListItem leftIcon="exit_to_app" selectable
                                  caption="Log out"/>
                    </List>
                </Left>
                <Middle>
                    <CurrentPlayback currentPlayback={this.state.currentPlayback}
                                     skipToNext={() => {
                                         Spotify.skipToNext({}).then(this.refreshAll, this.checkExpired);
                                     }}
                                     skipToPrev={() => {
                                         Spotify.skipToPrevious({}).then(this.refreshAll, this.checkExpired);
                                     }}
                                     onPlayClick={() => {
                                         if (this.state.currentPlayback.is_playing) {
                                             Spotify.pause({}).then(() => {
                                             }, this.checkExpired);
                                         } else {
                                             Spotify.play({}).then(() => {
                                             }, this.checkExpired);
                                         }
                                         this.setPlayState(!this.state.currentPlayback.is_playing);
                                     }}/>
                </Middle>
                <Right><RecentlyPlayed recentlyPlayed={this.state.recentlyPlayed} onClick={(data) => {
                    Spotify.play({uris: [data.track.uri]}).then(this.refreshAll, this.checkExpired);
                }}/></Right>
            </Container>
        );
    }
}
