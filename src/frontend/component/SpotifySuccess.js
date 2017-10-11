import React, {Component} from 'react';
import {connect} from 'react-redux';
import querystring from 'query-string';
import {actionDispatcher, namespaces, stateSelector} from '../redux/index';
import {Redirect} from 'react-router';
import {isValid} from '../lib/spotify';
import {ProgressBar} from 'react-toolbox/lib/progress_bar';
import styles from "./SpotifySuccess.css";

@connect(stateSelector(namespaces.router), actionDispatcher)
export class SpotifySuccess extends Component {
    constructor(props) {
        super(props);
        const {access_token} = querystring.parse(this.props.state.router.location.hash);
        this.state = {
            redirect: false,
            time: 0
        };
        const tick = setInterval(() => {
            this.setState((prev) => ({time: prev.time + 1}))
        }, 1000);

        isValid(access_token).then((valid) => {
            if (valid) {
                this.props.actions.spotify.setAccessToken(access_token);
            }
            setTimeout(() => {
                clearInterval(tick);
                this.setState({
                    redirect: valid ? "/app" : "/"
                });
            }, 3000);
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        } else {
            return <div className={styles.centered}>

                <div className={styles.pbar}>
                <ProgressBar mode='indeterminate'/>
                </div>
                <p className={styles.text}>Redirecting{".".repeat(this.state.time % 3 + 1)}</p>
            </div>;
        }
    }
}
