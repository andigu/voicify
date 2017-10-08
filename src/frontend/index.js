import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './component/App';
import {AppContainer} from 'react-hot-loader';

const rootEl = document.getElementById('app');

const render = () => {
    ReactDOM.render(
        <AppContainer>
            <App/>
        </AppContainer>,
        rootEl
    );
};


render();
