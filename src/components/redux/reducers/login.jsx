import * as actionType from '../types';

/**
* loginReducer will update the state with when a user has logged in or out.
*/
const loginReducer = (state = false, action) => {
  switch (action.type) {
    case actionType.LOGIN_TOGGLE_AUTHORIZED: {
      return action.payload.bool;
    }
    default: {
      return state;
    }
  }
};

export default loginReducer;
