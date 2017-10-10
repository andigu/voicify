import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card as RCard, CardMedia, CardTitle} from 'react-toolbox/lib/card';
import idx from 'idx';
import styled from 'styled-components';
import {Slider} from 'react-toolbox/lib/slider';
import {Button, IconButton} from 'react-toolbox/lib/button';
import _ from 'lodash';

function msToText(ms) {
    if (ms) {
        const seconds = Math.round(ms / 1000);
        const minutes = Math.round((seconds - seconds % 60) / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    } else {
        return '';
    }
}

export class CurrentPlayback extends Component {
    static propTypes = {
        currentPlayback: PropTypes.object,
        onPlayClick: PropTypes.func,
        skipToNext: PropTypes.func,
        skipToPrev: PropTypes.func
    };

    state = {
        time: idx(this.props.currentPlayback, (x) => x.progress_ms)
    };

    tick;

    componentWillReceiveProps(next) {
        this.setState({
            time: idx(next.currentPlayback, (x) => x.progress_ms)
        })
    }

    componentDidMount() {
        this.tick = setInterval(() => {
            if (idx(this.props.currentPlayback, (x) => x.is_playing)
                && idx(this.props.currentPlayback, (x) => x.progress_ms) <
                idx(this.props.currentPlayback, (x) => x.item.duration_ms)) {
                this.setState((prev) => ({
                    time: prev.time + 1000
                }))
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.tick);
    }

    render() {
        const Card = styled(RCard)`width: 60vh; align-self: center; margin-top: 30px`;
        const RowContainer = styled.div`display: flex; flex-direction: row; justify-content: center; align-items: center;`;

        const P = styled.p`font-family: Roboto,sans-serif`;
        return <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
            <Card>
                <CardTitle
                    title={idx(this.props.currentPlayback, (x) => x.item.name)}
                    subtitle={idx(this.props.currentPlayback, (x) => x.item.album.name)}/>
                <CardMedia image={idx(this.props.currentPlayback, (x) => x.item.album.images[0].url)}
                           aspectRatio="square"/>
            </Card>
            <RowContainer>
                <div style={{flex: 1, textAlign: 'right'}}>
                    <P>{msToText(this.state.time)}</P>
                </div>
                <Slider disabled
                        style={{flex: 13}}
                        value={_.isNumber(this.state.time) ? this.state.time : 0}
                        min={0}
                        max={idx(this.props.currentPlayback, (x) => x.item.duration_ms)}/>
                <div style={{flex: 1}}>
                    <P>{msToText(idx(this.props.currentPlayback, (x) => x.item.duration_ms))}</P>
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
