
const types = {
    setAccessToken: "setAccessToken"
};

const actions = {
  [types.setAccessToken]: null
};

const reducers = {
    [types.setAccessToken]: (state, {payload: accessToken}) => ({...state, accessToken})
};

export default {
    actions, reducers
}
