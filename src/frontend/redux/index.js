import {applyMiddleware, combineReducers, createStore} from 'redux';
import createHistory from 'history/createBrowserHistory';
import {routerMiddleware, routerReducer} from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';


export const history = createHistory();
const middleware = routerMiddleware(history);


export const store = createStore(combineReducers({
        router: routerReducer
    }),
    composeWithDevTools(applyMiddleware(...middleware))
);
