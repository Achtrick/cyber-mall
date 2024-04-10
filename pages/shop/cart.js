import { Skeleton } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartContent from "../../components/shop/CartContent";
import LoadingScreen from "../../components/shop/LoadingScreen";
import ShopLayout from "../../components/shop/ShopLayout";
import XButton from "../../components/ui-components/XButton";
import XHr from "../../components/ui-components/XHr";
import styles from "../../styles/shop/Cart.module.scss";
import { getError } from "../../utils/shared/getError";

function Cart(props) {
  const router = useRouter();
  const { shop } = router.query;
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
        enqueueSnackbar("Lien de shop invalide", { variant: "error" });
        router.push("/");
      }
    }
  }, [router, carts]);

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
    setCart(null);
  };

  const updateCart = async (product, action) => {
    dispatch({
      type: "UPDATE_CARTS",
      payload: {
        shop: shop,
        product: product,
        qtyAction: action,
      },
    });
  };

  const deleteProduct = (designation) => {
    dispatch({
      type: "DELETE_PRODUCT_CART",
      payload: {
        shop: shop,
        designation,
      },
    });
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
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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
        <ShopLayout
          title={"Mon panier"}
          description={
            "Laissez-nous tenir votre café pendant que vous faites vos shopping !"
          }
          shopInfo={shopInfo}
        >
          <div className={styles.container}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"calc(100vh - 200px)"}
              />
            ) : cart && cart.content?.length ? (
              <CartContent
                cart={cart}
                shopInfo={shopInfo}
                deleteProduct={deleteProduct}
                emptyCart={emptyCart}
                updateCart={updateCart}
                proceedToCheckout={false}
                freeShippingCounter={false}
              >
                <br />
                <div className="row">
                  <XHr color={shopInfo.settings.primaryColor} width="50%" />
                </div>
                <form onSubmit={placeOrder}>
                  <div className="row">
                    <input
                      name="firstName"
                      placeholder="Prénom"
                      type="text"
                      className="defaultInput"
                      value={user.firstName}
                      onChange={onChange}
                      required
                    />
                    &nbsp;
                    <input
                      name="lastName"
                      placeholder="Nom"
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
                      placeholder="Adresse"
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
                      placeholder="Code Postal"
                      type="text"
                      className="defaultInput"
                      value={user.postalCode}
                      onChange={onChange}
                      required
                    />
                    &nbsp;
                    <input
                      name="city"
                      placeholder="Ville"
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
                      placeholder="Téléphone"
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
                      text={"Passer la commande"}
                      loading={loadingOrder}
                    />
                  </div>
                </form>
              </CartContent>
            ) : (
              <div className={styles.emptyContainer}>
                <h2>Votre panier est vide !</h2>
                <div className="row">
                  <XHr color={shopInfo.settings.primaryColor} width="50px" />
                </div>
                <XButton
                  color={shopInfo.settings.primaryColor}
                  text={"allez faire du shopping"}
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
