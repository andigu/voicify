import {all, takeLatest} from "redux-saga/effects";
import {createActions, handleActions} from "redux-actions";
import {combineReducers as combReducers} from "redux";
import {objectMap} from "../lib/operators";

export const combineSagas = (obj: { [string]: any }, actionCreators) => all([].concat.apply([], Object.keys(obj).map((key) => {
  return Object.keys(obj[key]).map((key1) => {
    return takeLatest(`${key}/${key1}`, ...obj[key][key1], actionCreators[key]);
  });
})));
export const combineActions = (actionMap: any) => createActions(actionMap);
export const combineReducers = (reducers, initialState) => combReducers(objectMap(reducers,
  (val, key) => initialState[key] ?
    (state, action) => handleActions(val, initialState[key])(state, {
      ...action,
      type: action.type.replace(`${key}/`, '')
    })
    : val));


