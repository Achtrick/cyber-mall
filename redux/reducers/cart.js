import * as actionType from "../actionTypes";

export default (
  state = {
    carts:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("carts") || "[]")
        : [],
  },
  action
) => {
  switch (action.type) {
    case actionType.UPDATE_CARTS:
      let carts =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("carts") || "[]")
          : [];
      let cart = carts.find((cart) => cart.shop === action.payload.shop);
      let product;
      if (cart) {
        product = cart.content.find(
          (product) => product._id === action.payload.product._id
        );
        if (action.payload.qtyAction) {
          switch (action.payload.qtyAction) {
            case "PLUS":
              product.qty += 1;
              break;

            case "MINUS":
              product.qty -= 1;
              break;

            default:
              break;
          }
        } else {
          if (product) {
            product.qty += action.payload.product.qty;
          } else {
            cart.content.push(action.payload.product);
          }
        }
      } else {
        carts.push({
          shop: action.payload.shop,
          content: [{ ...action.payload.product }],
        });
      }
      typeof window !== "undefined"
        ? localStorage.setItem("carts", JSON.stringify(carts))
        : null;
      return { state, carts: carts };

    case actionType.EMPTY_CART:
      let _carts =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("carts") || "[]")
          : [];
      _carts = _carts.filter((cart) => cart.shop !== action.payload.shop);

      typeof window !== "undefined"
        ? localStorage.setItem("carts", JSON.stringify(_carts))
        : null;
      return { state, carts: _carts };
    case actionType.DELETE_PRODUCT_CART:
      let $carts =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("carts") || "[]")
          : [];
      let $cart = $carts.find((cart) => cart.shop === action.payload.shop);
      $cart.content = $cart.content.filter(
        (p) => p._id !== action.payload.productId
      );
      $carts.find((cart) => cart.shop === action.payload.shop).content =
        $cart.content;

      typeof window !== "undefined"
        ? localStorage.setItem("carts", JSON.stringify($carts))
        : null;
      return { state, carts: $carts };
    default:
      return state;
  }
};
