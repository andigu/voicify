import React, {Component} from 'react';
import {Button} from 'react-toolbox/lib/button';
import {connect} from 'react-redux';
import {encodeQueryData} from '../lib/uri';
import styled from 'styled-components';
import {SpotifyLoginButton} from './SpotifyLoginButton';
import {namespaces, stateSelector} from '../redux/index';
import {Redirect} from 'react-router';

@connect(stateSelector(namespaces.spotify))
export class Home extends Component {
    render() {
        return this.props.state.spotify.accessToken === null ? <SpotifyLoginButton/> : <Redirect to="/app"/>
    }
}
