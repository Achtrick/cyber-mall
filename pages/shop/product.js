import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { getError } from "../../utils/shared/getError";
import axios from "axios";
import LoadingScreen from "../../components/shop/LoadingScreen";
import ShopLayout from "../../components/shop/ShopLayout";
import styles from "../../styles/shop/Product.module.scss";
import { Button, Skeleton } from "@mui/material";
import XSwiper from "../../components/ui-components/XSwiper";
import XButton from "../../components/ui-components/XButton";
import XHr from "../../components/ui-components/XHr";
import { SwiperSlide } from "swiper/react";
import { calculateDiscount } from "../../utils/config/convertHelper";
import ProductsSlider from "../../components/shop/ProductsSlider";
import { useDispatch } from "react-redux";
import { AddIcon, RemoveIcon } from "../../utils/theme/icons";

function Product(props) {
  const router = useRouter();
  const { shop, id } = router.query;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [shopInfo, setShopInfo] = useState(null);
  const [product, setProduct] = useState(null);
  const [similars, setSimilars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingSimilars, setLoadingSimilars] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (router.isReady && router.query) {
      if (shop) {
        getShopInfo();
      } else {
        enqueueSnackbar("invalid shop link", { variant: "error" });
        router.push("/");
      }
    }
  }, [router]);

  useEffect(() => {
    if (router.isReady && shopInfo) {
      if (router.query.id) {
        getProduct(shopInfo._id);
      } else {
        enqueueSnackbar({ message: "invalid shop link !", variant: "error" });
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

      await getProduct(data._id);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const getProduct = async (shopId) => {
    setLoadingProduct(true);
    try {
      const { data } = await axios.post("/api/shop/get-product", {
        shopId: shopId,
        id: id,
      });
      setProduct(data);
      setLoadingProduct(false);
      !similars.length && (await getSimilars(data.shop, data.category));
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingProduct(false);
    }
  };

  const getSimilars = async (shopId, categoryId) => {
    setLoadingSimilars(true);
    try {
      const { data } = await axios.post("/api/shop/get-similar-products", {
        shopId: shopId,
        categoryId: categoryId,
      });
      setSimilars(data);
      setLoadingSimilars(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingSimilars(false);
    }
  };

  const addTocart = (shop, product) => {
    dispatch({
      type: "UPDATE_CARTS",
      payload: {
        shop,
        product: {
          ...product,
          qty: qty,
          price: product.discount
            ? calculateDiscount(product.price, product.discount)
            : product.price,
        },
      },
    });
    enqueueSnackbar(`added ${product.designation} to cart`, {
      variant: "info",
    });
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout shopInfo={shopInfo}>
          <div className={styles.container}>
            {loadingProduct ? (
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"calc(100vh - 200px)"}
              />
            ) : (
              <div className={styles.row}>
                <div className={styles.images}>
                  <XSwiper
                    autoplay={product.images.length > 1}
                    loop={product.images.length > 1}
                    pagination={product.images.length > 1}
                  >
                    {product.images.length ? (
                      product.images.map((image, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <img src={image} />
                          </SwiperSlide>
                        );
                      })
                    ) : (
                      <SwiperSlide>
                        <img src={"/images/image-placeholder.jpg"} />
                      </SwiperSlide>
                    )}
                  </XSwiper>
                </div>
                <div className={styles.infos}>
                  <h1>{product.designation}</h1>
                  {product.discount && product.discount !== 0 ? (
                    <p className={styles.oldPrice}>{product.price + " DT"}</p>
                  ) : null}
                  <p className={styles.price}>
                    {calculateDiscount(product.price, product.discount) + " DT"}
                  </p>
                  <div className={styles.quantity}>
                    <Button
                      style={{
                        color: shopInfo.settings.primaryColor,
                        width: "30px",
                        height: "30px",
                      }}
                      onClick={() => {
                        qty > 1 && setQty(qty - 1);
                      }}
                    >
                      <RemoveIcon />
                    </Button>
                    <span className={styles.qty}>{qty}</span>
                    <Button
                      style={{
                        color: shopInfo.settings.primaryColor,
                        width: "30px",
                        height: "30px",
                      }}
                      onClick={() => {
                        qty < product.qty && setQty(qty + 1);
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </div>
                  <XButton
                    color={shopInfo.settings.primaryColor}
                    text={"add to cart"}
                    action={() => {
                      addTocart(shop, product);
                    }}
                  />
                  <h2>{product.description}</h2>
                </div>
              </div>
            )}
            <div className="row">
              <XHr color={shopInfo.settings.primaryColor} width="40%" />
            </div>
            {loadingSimilars ? (
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"150px"}
                style={{ margin: "20px 0px" }}
              />
            ) : (
              <ProductsSlider
                settings={shopInfo.settings}
                shopName={shopInfo.name}
                products={similars}
                activateControls={true}
                title={"Checkout Similar Products !"}
                buttonAction={addTocart}
              />
            )}
          </div>
        </ShopLayout>
      )}
    </>
  );
}

export default Product;
