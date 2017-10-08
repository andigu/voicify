import React, {Component} from 'react';
import {connect} from 'react-redux';
import querystring from 'query-string';
import {actionDispatcher, namespaces, stateSelector} from '../redux/index';
import {Redirect} from 'react-router';
import {isValid} from '../lib/spotify';
import {ProgressBar} from 'react-toolbox/lib/progress_bar';

@connect(stateSelector(namespaces.router), actionDispatcher)
export class SpotifySuccess extends Component {
    constructor(props) {
        super(props);
        const {access_token} = querystring.parse(this.props.state.router.location.hash);
        this.state = {
            redirect: false
        };
        isValid(access_token).then((valid) => {
            if (valid) {
                this.props.actions.spotify.setAccessToken(access_token);
            }
            setTimeout(() => {
                this.setState({
                    redirect: valid ? "/app" : "/"
                });
            }, 2000);
        });

    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        } else {
            return <div>
                <p>Redirecting</p>
                <ProgressBar mode='indeterminate'/>
            </div>;
        }
    }
}
