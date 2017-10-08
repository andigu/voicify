import React from 'react';
import {Provider} from 'react-redux';
import {createStore, history} from '../redux';
import {Route} from 'react-router-dom';
import {Home} from './Home';
import {ConnectedRouter} from 'react-router-redux';
import {SpotifySuccess} from './SpotifySuccess';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {ProgressBar} from 'react-toolbox/lib/progress_bar';
import {MainApp} from './MainApp';

const {store, persistor} = createStore();
export const App = () => (
    <Provider store={store}>
        <PersistGate
            persistor={persistor}
            loading={<ProgressBar type='circular' mode='indeterminate' multicolor />}>
            <ConnectedRouter history={history}>
                <div>
                    <Route exact path="/" component={() => <Home/>}/>
                    <Route exact path="/spotify_cb" component={() => <SpotifySuccess/>}/>
                    <Route exact path="/app" component={() => <MainApp/>}/>
                </div>
            </ConnectedRouter>
        </PersistGate>
    </Provider>
);

