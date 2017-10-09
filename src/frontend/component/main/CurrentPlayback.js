import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card as RCard, CardMedia, CardTitle} from 'react-toolbox/lib/card';
import idx from 'idx';
import styled from 'styled-components';
import {Slider} from 'react-toolbox/lib/slider';
import {Button, IconButton} from 'react-toolbox/lib/button';

export class CurrentPlayback extends Component {
    static propTypes = {
        currentPlayback: PropTypes.object,
        onPlayClick: PropTypes.func,
        skipToNext: PropTypes.func,
        skipToPrev: PropTypes.func
    };

    render() {
        const Card = styled(RCard)`width: 60vh; align-self: center; margin-top: 30px`;
        const RowContainer = styled.div`display: flex; flex-direction: row; justify-content: center; align-items: center;`;

        return <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
            <Card>
                <CardTitle
                    title={idx(this.props.currentPlayback, (x) => x.item.name)}
                    subtitle={idx(this.props.currentPlayback, (x) => x.item.album.name)}/>
                <CardMedia image={idx(this.props.currentPlayback, (x) => x.item.album.images[0].url)}
                           aspectRatio="square"/>

            </Card>
            <RowContainer>
                <div style={{flex: 1, textAlign: "right"}}>
                    <p>Hi</p>
                </div>
                <Slider disabled
                        style={{flex: 13}}
                        value={this.props.currentPlayback.progress_ms}
                        min={0}
                        max={idx(this.props.currentPlayback, (x) => x.item.duration_ms)}/>
                <div style={{flex:1}}>
                    <p>Wow</p>
                </div>
            </RowContainer>
            <RowContainer>
                <IconButton icon='fast_rewind' onClick={this.props.skipToPrev} style={{marginRight: 10}}/>
                <Button icon={this.props.currentPlayback.is_playing ? 'pause' : 'play_arrow'} primary floating
                        onClick={this.props.onPlayClick}/>
                <IconButton icon='fast_forward' onClick={this.props.skipToNext} style={{marginLeft: 10}}/>
            </RowContainer>


        </div>;
    }
}
