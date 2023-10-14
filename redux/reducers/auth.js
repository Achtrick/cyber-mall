import * as actionType from "../actionTypes";

// eslint-disable-next-line import/no-anonymous-default-export
export default (
  state = {
    userInfo:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
  },
  action
) => {
  switch (action.type) {
    case actionType.USER_LOGIN:
      typeof window !== "undefined"
        ? localStorage.setItem("userInfo", JSON.stringify(action.payload))
        : null;
      return {
        ...state,
        userInfo: action.payload,
      };
    case actionType.USER_LOGOUT:
      typeof window !== "undefined"
        ? localStorage.removeItem("userInfo")
        : null;
      return { ...state, userInfo: null };
    default:
      return state;
  }
};
