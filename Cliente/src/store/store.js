import { createStore, combineReducers } from 'redux';

import authReducer from '../reducers/authReducer';
import adminReducer from '../reducers/adminReducer';

const appReducer = combineReducers({
    
    authReducer: authReducer,
    adminReducer: adminReducer,


})

export default createStore(appReducer);
