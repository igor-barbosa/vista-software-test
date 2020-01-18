import { createStore, combineReducers } from 'redux'
import clientsReducer from '../redux/clients/reducer';

export const store = createStore(combineReducers({
    clientsReducer
}));