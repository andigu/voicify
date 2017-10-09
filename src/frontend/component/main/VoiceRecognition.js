import React, {Component} from 'react';
import {Button} from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import styled, {keyframes} from 'styled-components';
import Artyom from 'artyom.js';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';

const Recognition = new Artyom();
Recognition.initialize({
    lang: 'en-US', // GreatBritain english
    continuous: true, // Listen forever
    soundex: true,// Use the soundex algorithm to increase accuracy
    debug: true, // Show messages in the console
    listen: true // Start to listen commands !
});

export class VoiceRecognition extends Component {
    static propTypes = {
        commands: PropTypes.arrayOf(PropTypes.shape({
            indexes: PropTypes.array,
            action: PropTypes.func
        }))
    };

    state = {
        active: false
    };
    deactivateTimeout;

    zoom = keyframes`
        0% {transform: scale(1)} 
        50% {transform: scale(1.25)}  
        100% {transform: scale(1)}`;

    constructor(props) {
        super(props);
        let commands = [];
        if (this.props.commands) {
            commands = this.props.commands.map(({indexes, action}) => ({
                indexes,
                action: (...args) => {
                    if (this.state.active) action(...args);
                }
            }));
        }
        Recognition.addCommands([{
            indexes: ['Hey spotify'],
            action: this.activate
        }, ...commands]);
    }

    @autobind
    activate() {
        if (this.deactivateTimeout) clearTimeout(this.deactivateTimeout);
        this.setState({active: true});
        this.deactivateTimeout = setTimeout(() => {
            this.setState({active: false});
            this.deactivateTimeout = null;
        }, 10000);
    }


    render() {
        const Icon = styled(FontIcon)`color: white; font-size: 32px; padding-top: 13px`;
        const AnimatedIcon = styled(Icon)`animation: ${this.zoom} 1s linear infinite`;
        const Btn = styled(Button)`transform: scale(1.1)`;
        return <div>
            <Btn icon={this.state.active ? <AnimatedIcon value='mic'/> : <Icon value='mic'/>} floating primary
                    onClick={this.activate}/>
        </div>;
    }
}
