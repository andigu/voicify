import 'regenerator-runtime/runtime';
import {applyMiddleware, bindActionCreators, createStore as reduxCreate} from 'redux';
import createHistory from 'history/createBrowserHistory';
import {routerMiddleware, routerReducer} from 'react-router-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {combineActions, combineReducers, combineSagas} from './utils';
import {objectMap} from '../lib/operators';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import createSagaMiddleware from 'redux-saga';

import spotifyRedux from './spotify';

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
        // [namespaces.spotify]: spotifyRedux.sagas,
    }, actionCreators);
}

export const history = createHistory();

export const createStore = () => {
    const ReduxConfig = {
        key: 'root',
        storage,
        blacklist: [namespaces.router, namespaces.status]
    };

    const rootReducer = persistReducer(ReduxConfig, combineReducers({
        [namespaces.router]: routerReducer,
        [namespaces.spotify]: spotifyRedux.reducers
    }, initialState));
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [routerMiddleware(history), sagaMiddleware];
    const enhancers = [];
    enhancers.push(applyMiddleware(...middleware));
    const store = reduxCreate(rootReducer, composeWithDevTools(...enhancers));
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
