import React, {Component} from 'react';
import styled from 'styled-components';
import {RecentlyPlayed} from './RecentlyPlayed';
import {VoiceRecognition} from './VoiceRecognition';
import {isExpired, Spotify} from '../../lib/spotify';
import {Dialog} from 'react-toolbox/lib/dialog';
import {SpotifyLoginButton} from '../SpotifyLoginButton';
import {CurrentPlayback} from './CurrentPlayback';
import autobind from 'autobind-decorator';
import {List, ListItem} from 'react-toolbox/lib/list';

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
                if (prev.currentPlayback.is_playing && prev.currentPlayback.progress_ms < prev.currentPlayback.item.duration_ms) {
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
        }, (err) => {
            if (isExpired(err)) {
                this.raiseRelogin();
            }
        });
    }

    refreshCurrentPlayback() {
        Spotify.getMyCurrentPlayingTrack().then((data) => {
            this.setState({
                currentPlayback: data
            });
        }, (err) => {
            if (isExpired(err)) {
                this.raiseRelogin();
            }
        });
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
        const Fab = styled.div`position: absolute; bottom: 20px; right: 20px`;

        const closeDialog = () => {
            this.setState({activeDialog: false});
        };
        return (
            <Container>
                <Dialog
                    actions={[
                        {label: 'Cancel', onClick: closeDialog}
                    ]}
                    active={this.state.activeDialog}
                    onEscKeyDown={closeDialog}
                    onOverlayClick={closeDialog}
                    title='Your Spotify Session has expired'>
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
                                         Spotify.skipToNext({}).then(this.refreshAll);
                                     }}
                                     skipToPrev={() => {
                                         Spotify.skipToPrevious({}).then(this.refreshAll);
                                     }}
                                     onPlayClick={() => {
                                         if (this.state.currentPlayback.is_playing) {
                                             Spotify.pause({});
                                         } else {
                                             Spotify.play({});
                                         }
                                         this.setState((prev) => ({
                                             ...prev,
                                             currentPlayback: {
                                                 ...prev.currentPlayback,
                                                 is_playing: !prev.currentPlayback.is_playing
                                             }
                                         }));
                                     }}/>
                </Middle>
                <Right><RecentlyPlayed recentlyPlayed={this.state.recentlyPlayed}/></Right>
                <Fab><VoiceRecognition/></Fab>
            </Container>
        );
    }
}
