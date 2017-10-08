import React from 'react';
import './App.css';
import {Provider} from 'react-redux';
import {history, createStore} from '../redux';
import {Route} from 'react-router-dom';
import {Home} from './Home';
import {ConnectedRouter} from 'react-router-redux';
import {SpotifySuccess} from './SpotifySuccess';

const {store, persistor} = createStore();
export const App = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <Route exact path="/" component={() => <Home/>}/>
                <Route exact path="/spotify_cb" component={() => <SpotifySuccess/>}/>
            </div>
        </ConnectedRouter>
    </Provider>
);

