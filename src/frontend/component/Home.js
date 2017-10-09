import React, {Component} from 'react';
import {Button} from 'react-toolbox/lib/button';
import {connect} from 'react-redux';
import {encodeQueryData} from '../lib/uri';
import styled from 'styled-components';
import {SpotifyLoginButton} from './SpotifyLoginButton';

@connect((state) => state, (dispatch) => ({}))
export class Home extends Component {
    render() {
        return <SpotifyLoginButton/>
    }
}
