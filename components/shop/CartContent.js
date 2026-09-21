import { Button, IconButton, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "../../styles/shop/Cart.module.scss";
import { deduceColor } from "../../utils/config/convertHelper";
import { AddIcon, DeleteIcon, RemoveIcon } from "../../utils/theme/icons";
import { ModalSizes } from "../admin/ModalSettings";
import XButton from "../ui-components/XButton";
import XModal from "../ui-components/XModal";
function CartContent({
  cart,
  shopInfo,
  updateCart,
  emptyCart,
  deleteProduct,
  proceedToCheckout,
  ...props
}) {
  const [product, setProduct] = useState(null);
  const [emptyCartAction, setEmptyCartAction] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <div className={styles.cart}>
      <XModal
        size={ModalSizes.SMALL}
        open={product !== null}
        title={"Remove From Cart"}
        onClose={() => setProduct(null)}
        cancelAction={() => setProduct(null)}
        confirmAction={() => {
          deleteProduct(product.designation);
          setProduct(null);
        }}
      >
        <p>{`Do you want to remove "${product?.designation}" from your cart?`}</p>
      </XModal>
      <XModal
        size={ModalSizes.SMALL}
        title={`Do you want to empty your cart?`}
        open={emptyCartAction}
        onClose={() => setEmptyCartAction(false)}
        cancelAction={() => setEmptyCartAction(false)}
        confirmAction={() => {
          emptyCart();
        }}
      >
        <p></p>
      </XModal>
      {shopInfo.freeShipping ? (
        <div
          className={styles.shippingCounterContainer}
          style={{
            backgroundColor: shopInfo.settings.headerColor,
            color: shopInfo.settings.headerColor,
          }}
        >
          <p
            style={{
              color: deduceColor(shopInfo.settings.headerColor),
            }}
          >
            {shopInfo.freeShipping -
              cart.content.reduce((sum, product) => {
                return sum + product.price * product.qty;
              }, 0) >
            0
              ? (
                  shopInfo.freeShipping -
                  cart.content.reduce((sum, product) => {
                    return sum + product.price * product.qty;
                  }, 0)
                ).toLocaleString() +
                " " +
                shopInfo.currency +
                " left for free shipping"
              : "✓ Free shipping"}
          </p>
          <br />
          <div className={styles.track}>
            <div
              className={styles.bar}
              style={{
                backgroundColor: shopInfo.settings.primaryColor,
                width:
                  (cart.content.reduce((sum, product) => {
                    return sum + product.price * product.qty;
                  }, 0) /
                    shopInfo.freeShipping) *
                    100 <
                  100
                    ? (cart.content.reduce((sum, product) => {
                        return sum + product.price * product.qty;
                      }, 0) /
                        shopInfo.freeShipping) *
                        100 +
                      "%"
                    : "100%",
              }}
            ></div>
          </div>
        </div>
      ) : null}
      <table
        className="defaultTable cart-content"
        style={{ overflow: "hidden" }}
      >
        <thead>
          <tr>
            <th>image</th>
            <th>designation</th>
            <th>price</th>
            <th>qty</th>
            <th>total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.content &&
            cart.content.map((product, index) => {
              return (
                <tr key={index}>
                  <td>
                    <img
                      alt={product.designation}
                      src={
                        product.images[0]
                          ? `/api/images/${product.images[0]
                              .split("/")
                              .pop()}?width=150&height=150`
                          : "/images/image-placeholder.jpg"
                      }
                      onError={(e) => {
                        e.target.src = "/images/image-placeholder.jpg";
                      }}
                    />
                  </td>
                  <td data-label="designation">{product.designation}</td>
                  <td data-label="price">
                    {product.price.toLocaleString() + " " + shopInfo.currency}
                  </td>
                  <td data-label="qty">
                    <div
                      className="row"
                      style={{
                        justifyContent: isMobile ? "flex-end" : "flex-start",
                      }}
                    >
                      <Button
                        style={{
                          color: shopInfo.settings.primaryColor,
                          width: "25px",
                          height: "25px",
                        }}
                        onClick={() => {
                          product.qty > 1 && updateCart(product, "MINUS");
                        }}
                        size="small"
                      >
                        <RemoveIcon />
                      </Button>
                      &nbsp;
                      <span>{product.qty}</span>
                      &nbsp;
                      <Button
                        style={{
                          color: shopInfo.settings.primaryColor,
                          width: "25px",
                          height: "25px",
                        }}
                        onClick={() => {
                          updateCart(product, "PLUS");
                        }}
                        size="small"
                      >
                        <AddIcon />
                      </Button>
                    </div>
                  </td>
                  <td data-label="total">
                    {(product.qty * product.price).toLocaleString() +
                      " " +
                      shopInfo.currency}
                  </td>
                  <td>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setProduct(product);
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          <tr>
            <th colSpan={4}>TOTAL</th>
            <th colSpan={2}>
              {cart.content &&
                cart.content
                  .reduce((sum, product) => {
                    return sum + product.price * product.qty;
                  }, 0)
                  .toLocaleString()}{" "}
              {shopInfo.currency} +{" "}
              {cart.content.reduce((sum, product) => {
                return sum + product.price * product.qty;
              }, 0) > shopInfo.freeShipping
                ? "✓ Free shipping"
                : "shipping fee : " +
                  shopInfo.shippingFee +
                  " " +
                  shopInfo.currency}
            </th>
          </tr>
        </tbody>
      </table>
      <div className="row" style={{ justifyContent: "flex-start" }}>
        <XButton
          color={shopInfo.settings.primaryColor}
          inversed={true}
          text={"empty cart"}
          action={() => setEmptyCartAction(true)}
        />
        &nbsp;
        {proceedToCheckout ? (
          <XButton
            color={shopInfo.settings.primaryColor}
            inversed={true}
            text={"Complete Your Purchase"}
            action={() => {
              dispatch({ type: "TOGGLE_CART_PREVIEW" });
              router.push(
                shopInfo?.domainName?.length
                  ? `/cart`
                  : `/${shopInfo.name}/cart`
              );
            }}
          />
        ) : null}
      </div>
      {props.children}
    </div>
  );
}

export default CartContent;
