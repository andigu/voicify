import React, {Component} from 'react';
import styled from 'styled-components';
import {RecentlyPlayed} from './RecentlyPlayed';
import {isExpired, isInvalid, Spotify} from '../../lib/spotify';
import {Dialog} from 'react-toolbox/lib/dialog';
import {SpotifyLoginButton} from '../SpotifyLoginButton';
import {CurrentPlayback} from './CurrentPlayback';
import autobind from 'autobind-decorator';
import {List, ListItem} from 'react-toolbox/lib/list';
import idx from 'idx';
import annyang from 'annyang';
import _ from 'lodash';
import {actionDispatcher, namespaces, stateSelector} from '../../redux/index';
import {Redirect} from 'react-router';
import {connect} from 'react-redux';
import {About} from "./About";

annyang.start({autoRestart: true, continuous: true});
annyang.debug(true);

@connect(stateSelector(namespaces.spotify), actionDispatcher)
export class MainApp extends Component {
    state = {
        activeDialog: false,
        currentPlayback: {}, // null will not set off componentwillreceiveprops
        recentlyPlayed: null,
        drawerActive: false,
        me: null,
        redirect: false,
        about: false,
        logout: false
    };

    refreshId;
    tick;

    constructor(props) {
        super(props);
        this.refreshAll();
        const commandData = {
            'play *song by *artist': (song, artist) => {
                Spotify.search(song, ['track'], {artist}).then((song) => {
                    const songUri = idx(song, (x) => x.tracks.items[0].uri);
                    if (songUri) Spotify.play({uris: [songUri]}).then(this.refreshAll, this.checkExpired);
                }, this.checkExpired);
            },
            'play *song': (song) => {
                Spotify.search(song, ['track']).then((song) => {
                    const songUri = idx(song, (x) => x.tracks.items[0].uri);
                    if (songUri) Spotify.play({uris: [songUri]}).then(this.refreshAll, this.checkExpired);
                }, this.checkExpired);
            },
            'resume': () => {
                this.setPlayState(true);
                Spotify.play({}).then(() => {
                }, this.checkExpired);
            },
            'pause': () => {
                this.setPlayState(false);
                Spotify.pause({}).then(() => {
                }, this.checkExpired);
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
        Spotify.getMyCurrentPlaybackState().then((data) => {
            this.setState({
                currentPlayback: data
            });
        }, this.checkExpired);
    }

    @autobind
    checkExpired(err) {
        if (isInvalid(err)) {
            this.raiseRelogin('Your session is invalid. Please login again.');
        }
        else if (isExpired(err)) {
            this.raiseRelogin('Your session expired. Please log in again.');
        }
    }

    raiseRelogin(message) {
        this.setState({
            activeDialog: message
        });
    }

    render() {
        if (this.state.redirect || this.props.state.spotify.accessToken === null) return <Redirect to={'/'}/>;
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
        const setAllClosed = () => {
            this.setState({about: false, logout: false});
        };
        return (
            <Container>
                <Dialog active={_.isString(this.state.activeDialog)}
                        title='Your Spotify session has expired'>
                    {this.state.activeDialog}
                    <br/>
                    <br/>
                    <SpotifyLoginButton text="Login"/>
                </Dialog>
                <Dialog title="About" active={this.state.about} onOverlayClick={setAllClosed}
                        onEscKeyDown={setAllClosed}>
                    <About/>
                </Dialog>
                <Dialog title="Are you sure?"
                        active={this.state.logout}
                        onOverlayClick={setAllClosed}
                        actions={[{label: 'Cancel', onClick: setAllClosed}, {
                            label: 'Yes',
                            onClick: () => {
                                this.props.actions.spotify.setAccessToken(null);
                                this.setState({redirect: true});
                            }
                        }]}
                        onEscKeyDown={setAllClosed}>
                    <p>This will log you out.</p>
                </Dialog>
                <Left>
                    <List>
                        <ListItem leftIcon="info"
                                  selectable
                                  onClick={() => {
                                      this.setState({about: true});
                                  }}
                                  caption="About"/>
                        <ListItem leftIcon="exit_to_app"
                                  selectable
                                  onClick={() => {
                                      this.setState({logout: true});
                                  }}
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
