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
    default:
      return state;
  }
};
