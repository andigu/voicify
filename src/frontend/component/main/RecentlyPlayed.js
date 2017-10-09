import React, {Component} from 'react';
import {List, ListItem, ListSubHeader} from 'react-toolbox/lib/list';
import {Spotify} from '../../lib/spotify';
import {connect} from "react-redux";
import idx from "idx";
import styled from "styled-components";

@connect((state) => state)
export class RecentlyPlayed extends Component {
    state = {
        tracks: []
    };

    componentDidMount() {
        Spotify.getMyRecentlyPlayedTracks().then((data) => {
            this.setState({
                tracks: data.items
            });
        });
    }

    render() {
        const Li = styled(ListItem)`cursor: pointer`;
        return <List selectable ripple>
            <ListSubHeader caption='Explore characters'/>
            {this.state.tracks.map((data, i) => {
                return <Li
                    key={i}
                    avatar={idx(data, (data) => data.track.album.images[0].url)}
                    caption={idx(data, (data) => data.track.name)}
                    legend={idx(data, (data) => data.track.album.name)}
                />})}

        </List>;
    }
}
