import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { getError } from "../../utils/shared/getError";
import axios from "axios";
import LoadingScreen from "../../components/shop/LoadingScreen";
import ShopLayout from "../../components/shop/ShopLayout";
import styles from "../../styles/shop/Product.module.scss";
import { Skeleton } from "@mui/material";
import XSwiper from "../../components/ui-components/XSwiper";
import XButton from "../../components/ui-components/XButton";
import XHr from "../../components/ui-components/XHr";
import { SwiperSlide } from "swiper/react";
import { calculateDiscount } from "../../utils/config/convertHelper";
import ProductsSlider from "../../components/shop/ProductsSlider";

function product(props) {
  const router = useRouter();
  const { shop, id } = router.query;
  const { enqueueSnackbar } = useSnackbar();

  const [shopInfo, setShopInfo] = useState(null);
  const [product, setProduct] = useState(null);
  const [similars, setSimilars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingSimilars, setLoadingSimilars] = useState(true);

  useEffect(() => {
    if (shop) getShopInfo();
  }, [shop]);

  const getShopInfo = async () => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: router.query.shop,
      });

      setShopInfo(data);
      setLoading(false);

      await getProduct(data._id);
    } catch (error) {
      console.log(error);
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
      await getSimilars(data.shop, data.category);
      setLoadingProduct(false);
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
                  <XSwiper autoplay={true} loop={true} pagination={true}>
                    {product.images.map((image, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <img src={image} />
                        </SwiperSlide>
                      );
                    })}
                  </XSwiper>
                </div>
                <div className={styles.infos}>
                  <h1>{product.designation}</h1>
                  <h2>{product.description}</h2>
                  {product.discount && product.discount !== 0 ? (
                    <p className={styles.oldPrice}>{product.price + " DT"}</p>
                  ) : null}
                  <p className={styles.price}>
                    {calculateDiscount(product.price, product.discount) + " DT"}
                  </p>
                  <XButton
                    color={shopInfo.settings.primaryColor}
                    text={"add to cart"}
                    action={() => {
                      console.log("add to cart");
                    }}
                  />
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
              />
            )}
          </div>
        </ShopLayout>
      )}
    </>
  );
}

export default product;
