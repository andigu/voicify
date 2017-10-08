import {put} from 'redux-saga/effects';
import {Spotify} from '../lib/spotify';

const types = {
    setAccessToken: 'setAccessToken',
    clearAccessToken: 'clearAccessToken'
};

const actions = {
    [types.setAccessToken]: null,
    [types.clearAccessToken]: null
};

const reducers = {
    [types.setAccessToken]: (state, {payload: accessToken}) => ({...state, accessToken}),
    [types.clearAccessToken]: (state) => ({...state, accessToken: null})
};

const sagas = {
    [types.setAccessToken]: [setAccessToken]
};

function* setAccessToken(_, {payload: accessToken}) {
    Spotify.setAccessToken(accessToken);
}

export default {
    actions, reducers, sagas
};
