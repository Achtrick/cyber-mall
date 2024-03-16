import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { getError } from "../../utils/shared/getError";
import axios from "axios";
import LoadingScreen from "../../components/shop/LoadingScreen";
import ShopLayout from "../../components/shop/ShopLayout";
import styles from "../../styles/shop/Cart.module.scss";
import { Button, IconButton, Skeleton } from "@mui/material";
import XSwiper from "../../components/ui-components/XSwiper";
import XButton from "../../components/ui-components/XButton";
import XHr from "../../components/ui-components/XHr";
import { SwiperSlide } from "swiper/react";
import { calculateDiscount } from "../../utils/config/convertHelper";
import ProductsSlider from "../../components/shop/ProductsSlider";
import { useDispatch, useSelector } from "react-redux";
import { AddIcon, DeleteIcon, RemoveIcon } from "../../utils/theme/icons";

function Cart(props) {
  const router = useRouter();
  const { shop, id } = router.query;
  const { carts } = useSelector((state) => state.cart);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [shopInfo, setShopInfo] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
  });
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    if (router.isReady && router.query) {
      if (shop) {
        getShopInfo();
        setCart(carts.find((cart) => cart.shop === shop));
      } else {
        enqueueSnackbar("invalid shop link", { variant: "error" });
        router.push("/");
      }
    }
  }, [router]);

  const getShopInfo = async () => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: router.query.shop,
      });

      setShopInfo(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const emptyCart = () => {
    dispatch({
      type: "EMPTY_CART",
      payload: {
        shop: shop,
      },
    });
    setCart([]);
  };

  const deleteProduct = (productId) => {
    dispatch({
      type: "DELETE_PRODUCT_CART",
      payload: {
        shop: shop,
        productId,
      },
    });
    let newContent = cart.content.filter((p) => p._id !== productId);
    cart.content = newContent;
    setCart(cart);
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoadingOrder(true);
    try {
      const { data } = await axios.post("/api/shop/place-order", {
        shop: shopInfo._id,
        user: user,
        products: cart.content,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      emptyCart();
      setLoadingOrder(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingOrder(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout shopInfo={shopInfo}>
          <div className={styles.container}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"calc(100vh - 200px)"}
              />
            ) : cart && cart.content?.length ? (
              <div className={styles.cart}>
                <table className="defaultTable">
                  <thead>
                    <tr>
                      <th>image</th>
                      <th>designation</th>
                      <th>price</th>
                      <th>qty</th>
                      <th>unit total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.content &&
                      cart.content.map((product) => {
                        return (
                          <tr key={product._id}>
                            <td>
                              <img
                                alt={product.designation}
                                src={
                                  product.images[0]
                                    ? `/api/images/${product.images[0]
                                        .split("/")
                                        .pop()}`
                                    : "/images/image-placeholder.jpg"
                                }
                                onError={(e) => {
                                  e.target.src =
                                    "/images/image-placeholder.jpg";
                                }}
                              />
                            </td>
                            <td>{product.designation}</td>
                            <td>{product.price.toLocaleString() + " DT"}</td>
                            <td>{product.qty}</td>
                            <td>
                              {(product.qty * product.price).toLocaleString() +
                                " DT"}
                            </td>
                            <td>
                              <IconButton
                                color="error"
                                onClick={() => {
                                  deleteProduct(product._id);
                                }}
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
                        DT + shipping fee: {shopInfo.shippingFee} DT
                      </th>
                    </tr>
                  </tbody>
                </table>
                <div className="row" style={{ justifyContent: "flex-start" }}>
                  <XButton
                    color={shopInfo.settings.primaryColor}
                    inversed={true}
                    text={"empty cart"}
                    action={emptyCart}
                  />
                </div>
                <br />
                <div className="row">
                  <XHr color={shopInfo.settings.primaryColor} width="100%" />
                </div>
                <form onSubmit={placeOrder}>
                  <div className="row">
                    <input
                      name="firstName"
                      placeholder="First Name"
                      type="text"
                      className="defaultInput"
                      value={user.firstName}
                      onChange={onChange}
                      required
                    />
                    &nbsp;
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      type="text"
                      className="defaultInput"
                      value={user.lastName}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="row">
                    <input
                      name="address"
                      placeholder="Address"
                      type="text"
                      className="defaultInput"
                      value={user.address}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="row">
                    <input
                      name="postalCode"
                      placeholder="Postal Code"
                      type="text"
                      className="defaultInput"
                      value={user.postalCode}
                      onChange={onChange}
                      required
                    />
                    &nbsp;
                    <input
                      name="city"
                      placeholder="City"
                      type="text"
                      className="defaultInput"
                      value={user.city}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="row">
                    <input
                      name="phone"
                      placeholder="Phone"
                      type="number"
                      className="defaultInput"
                      value={user.phone}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="row" style={{ justifyContent: "flex-start" }}>
                    <XButton
                      color={shopInfo.settings.primaryColor}
                      inversed={true}
                      text={"place order"}
                      loading={loadingOrder}
                    />
                  </div>
                </form>
              </div>
            ) : (
              <div className={styles.emptyContainer}>
                <h2>your cart is empty !</h2>
                <div className="row">
                  <XHr color={shopInfo.settings.primaryColor} width="250px" />
                </div>
                <XButton
                  color={shopInfo.settings.primaryColor}
                  text={"go shopping"}
                  action={() => router.push(`/shop/products?shop=${shop}`)}
                />
              </div>
            )}
          </div>
        </ShopLayout>
      )}
    </>
  );
}

export default Cart;
