import { Button, Skeleton } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SwiperSlide } from "swiper/react";
import LoadingScreen from "../../../components/shop/LoadingScreen";
import ProductsSlider from "../../../components/shop/ProductsSlider";
import ShopLayout from "../../../components/shop/ShopLayout";
import XButton from "../../../components/ui-components/XButton";
import XHr from "../../../components/ui-components/XHr";
import XMagnifier from "../../../components/ui-components/XMagnifier";
import XSwiper from "../../../components/ui-components/XSwiper";
import styles from "../../../styles/shop/Product.module.scss";
import {
  calculateDiscount,
  deduceColor,
} from "../../../utils/config/convertHelper";
import { getError } from "../../../utils/shared/getError";
import { AddIcon, RemoveIcon } from "../../../utils/theme/icons";

function Product({ shop }) {
  const router = useRouter();
  const { id } = router.query;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [shopInfo, setShopInfo] = useState(null);
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [similars, setSimilars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingSimilars, setLoadingSimilars] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (shop) {
      getShopInfo();
    } else {
      enqueueSnackbar("Lien de shop invalide", { variant: "error" });
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (router.isReady && shopInfo) {
      if (router.query.id) {
        getProduct(shopInfo._id);
      } else {
        enqueueSnackbar({
          message: "Lien de shop invalide !",
          variant: "error",
        });
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
      data.variants && setSelectedVariant(data.variants[0]);
      setLoadingProduct(false);
      !similars.length && (await getSimilars(data.shop, data.category._id));
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
    dispatch({ type: "TOGGLE_CART_PREVIEW" });
    enqueueSnackbar(`${product.designation} Ajouté au panier`, {
      variant: "info",
    });
  };

  const tagStyle = {
    color: shopInfo?.settings.primaryColor,
    border: `1px solid ${shopInfo?.settings.primaryColor}`,
  };

  const activeTagStyle = {
    color: shopInfo && deduceColor(shopInfo?.settings.primaryColor),
    backgroundColor: shopInfo?.settings.primaryColor,
  };

  const tagMouseOver = (e) => {
    e.target.style.backgroundColor = shopInfo?.settings.primaryColor;
    e.target.style.color = deduceColor(shopInfo?.settings.primaryColor);
  };

  const tagMouseLeave = (e) => {
    e.target.style.backgroundColor = "white";
    e.target.style.color = shopInfo?.settings.primaryColor;
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout
          title={product?.designation}
          description={product?.description}
          image={
            product?.image && `/api/images/${product?.image.split("/").pop()}`
          }
          tags={[product?.designation, product?.category.name]}
          shopInfo={shopInfo}
        >
          <div className={styles.container}>
            {loadingProduct ? (
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"calc(100vh - 250px)"}
              />
            ) : (
              <div className={styles.row}>
                <div className={styles.images}>
                  <XSwiper
                    autoplay={false}
                    loop={product.images.length > 1}
                    pagination={product.images.length > 1}
                  >
                    {product.images.length ? (
                      product.images.map((image, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <XMagnifier image={image} alt={product.designation}>
                              <img
                                src={`/api/images/${image.split("/").pop()}`}
                                onError={(e) => {
                                  e.target.src =
                                    "/images/image-placeholder.jpg";
                                }}
                                alt={product.designation}
                              />
                            </XMagnifier>
                          </SwiperSlide>
                        );
                      })
                    ) : (
                      <SwiperSlide>
                        <img
                          alt={product.designation}
                          src={"/images/image-placeholder.jpg"}
                        />
                      </SwiperSlide>
                    )}
                  </XSwiper>
                </div>
                <div className={styles.infos}>
                  <h1>{product.designation}</h1>
                  {product.discount && product.discount !== 0 ? (
                    <p className={styles.oldPrice}>
                      {product.price.toLocaleString() + " DT"}
                    </p>
                  ) : null}
                  <p className={styles.price}>
                    {calculateDiscount(
                      product.price,
                      product.discount
                    ).toLocaleString() + " DT"}
                  </p>
                  {product.variants.length ? (
                    <>
                      <br />
                      <label>variantes</label>
                      <div className="tagsRow">
                        {product.variants.map((variant, key) => {
                          return (
                            <span
                              style={
                                selectedVariant === variant
                                  ? activeTagStyle
                                  : tagStyle
                              }
                              onMouseOver={
                                selectedVariant === variant
                                  ? null
                                  : tagMouseOver
                              }
                              onMouseLeave={
                                selectedVariant === variant
                                  ? null
                                  : tagMouseLeave
                              }
                              className="tag"
                              key={key}
                              onClick={() => setSelectedVariant(variant)}
                            >
                              {variant}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  ) : null}

                  <br />
                  <label>quantité</label>
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
                        setQty(qty + 1);
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </div>
                  <XButton
                    color={shopInfo.settings.primaryColor}
                    width={"100px"}
                    text={"Acheter"}
                    action={() => {
                      addTocart(shop, {
                        ...product,
                        designation: selectedVariant
                          ? product.designation + " | " + selectedVariant
                          : product.designation,
                      });
                    }}
                  />
                  <pre>{product.description}</pre>
                </div>
              </div>
            )}
            <div className="row">
              <XHr color={shopInfo.settings.primaryColor} width="20%" />
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
                shopInfo={shopInfo}
                products={similars}
                activateControls={true}
                title={"Découvrir des produits similaires !"}
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

export function getServerSideProps(context) {
  return {
    props: { shop: context.params.shop },
  };
}
