import React, {Component} from 'react';
import {connect} from 'react-redux';
import querystring from 'query-string';
import superagent from 'superagent';
import request from "request";
import {actionDispatcher, namespaces, stateSelector} from '../redux/index';

@connect(stateSelector(namespaces.router), actionDispatcher)
export class SpotifySuccess extends Component {
    constructor(props) {
        super(props);
        const {access_token} = querystring.parse(this.props.state.router.location.hash);
        if (access_token) this.props.actions.spotify.setAccessToken(access_token);
    }

    render() {
        return <div>
            <p>Hello</p>
        </div>;
    }
}
