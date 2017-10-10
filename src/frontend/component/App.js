import React from 'react';
import "./main/Li.css";
import {Provider} from 'react-redux';
import {createStore, history} from '../redux';
import {Route} from 'react-router-dom';
import {Home} from './Home';
import {ConnectedRouter} from 'react-router-redux';
import {SpotifySuccess} from './SpotifySuccess';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {ProgressBar} from 'react-toolbox/lib/progress_bar';
import {MainApp} from './main/MainApp';
import {Redirect, Switch} from 'react-router';

const {store, persistor} = createStore();

export const App = () => (
    <Provider store={store}>
        <PersistGate
            persistor={persistor}
            loading={<ProgressBar type='circular' mode='indeterminate' multicolor />}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/" component={() => <Home/>}/>
                    <Route exact path="/spotify_cb" component={() => <SpotifySuccess/>}/>
                    <Route exact path="/app" component={() => <MainApp/>}/>
                    <Route component={() => <Redirect to="/"/>}/>
                </Switch>
            </ConnectedRouter>
        </PersistGate>
    </Provider>
);

