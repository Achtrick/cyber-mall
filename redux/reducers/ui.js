import * as actionType from "../actionTypes";

export default (
  state = {
    profileMenu: false,
    openSearch: false,
  },
  action
) => {
  switch (action.type) {
    case actionType.OPEN_PROFILE_MENU:
      return {
        ...state,
        profileMenu: true,
      };
    case actionType.CLOSE_PROFILE_MENU:
      return {
        ...state,
        profileMenu: false,
      };
    case actionType.OPEN_SEARCH_MENU:
      return {
        ...state,
        openSearch: true,
      };
    case actionType.CLOSE_SEARCH_MENU:
      return {
        ...state,
        openSearch: false,
      };
    default:
      return state;
  }
};
