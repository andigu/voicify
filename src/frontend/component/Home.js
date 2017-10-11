import React, {Component} from 'react';
import {connect} from 'react-redux';
import {namespaces, stateSelector} from '../redux/index';
import {Redirect} from 'react-router';
import styles from './App.css';
import {SpotifyLoginButton} from './SpotifyLoginButton';

@connect(stateSelector(namespaces.spotify))
export class Home extends Component {
    render() {
        if (this.props.state.spotify.accessToken !== null) {
            return <Redirect to="/app"/>;
        } else {
            return <div className={styles.container}>
                <h1 className={styles.header}>Voicify.</h1>
                <div className={styles.loginbtn}>
                <SpotifyLoginButton text={"Get started now"}/>
                </div>
            </div>;
        }
    }
}
