import * as actionType from '../types';

/**
* Defines action to toggle authrorized state.
*
* bool      - true/false.
*/
const actionToggleAuthorized = bool => ({
  type: actionType.LOGIN_TOGGLE_AUTHORIZED,
  payload: { bool },
  meta: {},
});

export default actionToggleAuthorized;
