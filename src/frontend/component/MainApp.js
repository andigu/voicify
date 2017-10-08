import React, {Component} from 'react';
import {Button} from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import styled from 'styled-components';

export class MainApp extends Component {
    render() {
        const Icon =
            styled(FontIcon)`
color:
 red`;
        return <div>
            <Button icon={<Icon value='mic'/>} floating/>
        </div>;
    }
}
