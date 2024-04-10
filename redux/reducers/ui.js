import * as actionType from "../actionTypes";

export default (
  state = {
    cartPreviewOpen: false,
  },
  action
) => {
  switch (action.type) {
    case actionType.TOGGLE_CART_PREVIEW:
      return { state, cartPreviewOpen: !state.cartPreviewOpen };
    case actionType.CLOSE_CART_PREVIEW:
      return { state, cartPreviewOpen: false };
    default:
      return state;
  }
};
