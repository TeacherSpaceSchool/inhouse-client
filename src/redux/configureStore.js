import { createStore, applyMiddleware, combineReducers } from 'redux'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'
import app from './reducers/app'
import user from './reducers/user'
import mini_dialog from './reducers/mini_dialog'
import snackbar from './reducers/snackbar'

export let store

const bindMiddleware = (middleware) => {
    return applyMiddleware(...middleware)
}

const combinedReducer = combineReducers({
    app,
    user,
    mini_dialog,
    snackbar
})

const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        }
        return nextState
    } else {
        return combinedReducer(state, action)
    }
}


const initStore = () => {
    store = createStore(reducer, bindMiddleware([thunkMiddleware]))
    return store
}

export const wrapper = createWrapper(initStore)