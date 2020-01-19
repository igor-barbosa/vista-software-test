import { createStore, combineReducers } from 'redux'
import clientsReducer from '../redux/clients/reducer';
import propertyOwnerReducer from '../redux/property-owner/reducer';
import propertiesReducer from '../redux/properties/reducer';
import contractReducer from '../redux/contracts/reducer';

export const store = createStore(combineReducers({
    clientsReducer,
    propertyOwnerReducer,
    propertiesReducer,
    contractReducer
}));