import 'regenerator-runtime/runtime';
import {applyMiddleware, bindActionCreators, compose, createStore as reduxCreate} from 'redux';
import createHistory from 'history/createBrowserHistory';
import {routerMiddleware, routerReducer} from 'react-router-redux';
import {combineActions, combineReducers, combineSagas} from './utils';
import {objectMap} from '../lib/operators';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import getStoredState from 'redux-persist/es/getStoredState';

import spotifyRedux from './spotify';
import {Spotify} from '../lib/spotify';

export const namespaces = {
    spotify: 'spotify',
    router: 'router'
};
const initialState = {
    [namespaces.spotify]: {accessToken: null}
};

export const actionCreators = combineActions({
    [namespaces.spotify]: spotifyRedux.actions
});

function* rootSaga() {
    yield combineSagas({
        [namespaces.spotify]: spotifyRedux.sagas
    }, actionCreators);
}

export const history = createHistory();

export const createStore = () => {
    const ReduxConfig = {
        key: 'root',
        storage,
        blacklist: [namespaces.router],
        debug: true
    };
    getStoredState(ReduxConfig).then((state) => {
        Spotify.setAccessToken(state.spotify.accessToken); // set access token
    });

    const rootReducer = persistReducer(ReduxConfig, combineReducers({
        [namespaces.router]: routerReducer,
        [namespaces.spotify]: spotifyRedux.reducers
    }, initialState));
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [routerMiddleware(history), sagaMiddleware];
    const enhancers = [];
    enhancers.push(applyMiddleware(...middleware));
    const store = reduxCreate(rootReducer, compose(...enhancers));
    sagaMiddleware.run(rootSaga);
    let persistor = persistStore(store);
    return {store, persistor};
};


export const actionDispatcher = (dispatch) => ({actions: objectMap(actionCreators, (value) => bindActionCreators(value, dispatch))});

export const stateSelector = (...namespaces) => ((state) => ({
    state: namespaces.reduce((x, namespace) => ({
        ...x,
        [namespace]: state[namespace]
    }), {})
}));
