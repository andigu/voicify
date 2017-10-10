import React, {Component} from 'react';
import {List, ListItem, ListSubHeader} from 'react-toolbox/lib/list';
import {connect} from 'react-redux';
import idx from 'idx';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {ProgressBar} from 'react-toolbox/lib/progress_bar';
import theme from './Li.css';

@connect((state) => state)
export class RecentlyPlayed extends Component {
    static propTypes = {
        recentlyPlayed: PropTypes.array,
        onClick: PropTypes.func
    };

    render() {
        const Li = styled(ListItem)`cursor: pointer`;
        const PbCont = styled.div`width: 100%; height: 80vh; display: flex; align-items: center; justify-content: center`;
        return <List selectable ripple>
            <ListSubHeader caption='Recently Played'/>
            {this.props.recentlyPlayed === null ?
                <PbCont><ProgressBar mode="indeterminate" type="circular" multicolor/></PbCont> :
                this.props.recentlyPlayed.map((data, i) => {
                    return <Li key={i}
                               theme={theme}
                               onClick={() => {this.props.onClick(data)}}
                               avatar={idx(data, (data) => data.track.album.images[0].url)}
                               caption={idx(data, (data) => data.track.name)}
                               legend={idx(data, (data) => data.track.album.name)}/>;
                })}

        </List>;
    }
}
