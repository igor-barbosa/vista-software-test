import { createStore, combineReducers } from 'redux'
import clientsReducer from '../redux/clients/reducer';
import propertyOwnerReducer from '../redux/property-owner/reducer';


export const store = createStore(combineReducers({
    clientsReducer,
    propertyOwnerReducer
}));