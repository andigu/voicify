import React, {Component} from 'react';
import styled from 'styled-components';
import {RecentlyPlayed} from './RecentlyPlayed';
import {VoiceRecognition} from './VoiceRecognition';

export class MainApp extends Component {
    render() {
        const Container = styled.div`display: flex; flex-direction: row`;

        const Base = styled.div`
            height: 100vh; 
            overflow-y: scroll; 
            ::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);background-color: #F5F5F5;}
            ::-webkit-scrollbar {width: 6px;background-color: #F5F5F5;}
            ::-webkit-scrollbar-thumb{background-color: #000000;}`;
        const Left = Base.extend`flex: 3; background-color: red;`;
        const Right = Base.extend`flex: 1; height: 100vh; overflow-y: scroll`;
        const Fab = styled.div`position: absolute; bottom: 20px; right: 20px`;
        return (
            <Container>
                <Left>
                    <div style={{backgroundColor: 'white', height: 50, width: 50}}/>
                </Left>
                <Right><RecentlyPlayed/></Right>
                <Fab><VoiceRecognition/></Fab>
            </Container>
        );
    }
}
