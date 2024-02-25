import { ADMIN_ENABLED } from '../actions/adminActions';
import { ADMIN_DISABLED } from '../actions/adminActions';

const initialState = {
    isAdmin: localStorage.getItem('admin'),
};

const adminReducer = (state = initialState, action) => {
    switch(action.type){

        case ADMIN_ENABLED:
            return {
                ...state,
                ...action.payload,
            };
        
        case ADMIN_DISABLED:
            return {
                ...state,
                ...action.payload,
            };

        default:
            return state;
    }
}

export default adminReducer;