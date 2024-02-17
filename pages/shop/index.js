import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/shop/LoadingScreen";
import axios from "axios";
import ShopLayout from "../../components/shop/ShopLayout";
import styles from "../../styles/shop/Index.module.scss";
import HomeSlider from "../../components/shop/HomeSlider";
import CategoriesGrid from "../../components/shop/CategoriesGrid";
import XHr from "../../components/ui-components/XHr";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/shared/getError";
import { Skeleton } from "@mui/material";
import XGallery from "../../components/ui-components/XGallery";
import ProductsSlider from "../../components/shop/ProductsSlider";
import { calculateDiscount } from "../../utils/config/convertHelper";
import { useDispatch } from "react-redux";

function Shop(props) {
  const router = useRouter();
  const { shop } = router.query;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [loadingSlider, setLoadingSlider] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);

  const [shopInfo, setShopInfo] = useState({});
  const [sliderInfo, setSliderInfo] = useState([]);
  const [galleryInfo, setGalleryInfo] = useState({});
  const [architecture, setArchitecture] = useState({});
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);

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

  const getShopInfo = async () => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: shop,
        getHomeInfo: true,
      });

      setShopInfo(data);
      setArchitecture(data.architecture);
      setLoading(false);

      getSliderInfo();
      getGalleryInfo();
      getDiscounts(data._id);
      getCategories(data._id);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const getSliderInfo = async () => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: shop,
        getHomeInfo: true,
        excludedSection: "galleryComponent",
      });

      setSliderInfo(data.architecture.home.sliderComponent);
      setLoadingSlider(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const getGalleryInfo = async () => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: shop,
        getHomeInfo: true,
        excludedSection: "sliderComponent",
      });

      setGalleryInfo(data.architecture.home.galleryComponent);
      setLoadingGallery(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const getCategories = async (shopId) => {
    setLoadingCategories(true);
    try {
      const { data } = await axios.post("/api/admin/categories/get", {
        shop: shopId,
      });
      setCategories(data);
      setLoadingCategories(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingCategories(false);
    }
  };

  const getDiscounts = async (shopId) => {
    setLoadingDiscounts(true);

    try {
      const { data } = await axios.post("/api/shop/get-random-discounts", {
        shopId: shopId,
      });
      setDiscounts(data);
      setLoadingDiscounts(false);
    } catch (error) {
      setLoadingDiscounts(false);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const addTocart = (shop, product) => {
    dispatch({
      type: "UPDATE_CARTS",
      payload: {
        shop,
        product: {
          ...product,
          qty: 1,
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
          <section>
            <div style={{ marginBottom: "20px", width: "100%" }}>
              {loadingSlider ? (
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"60vh"}
                  style={{ margin: "20px 0px" }}
                />
              ) : (
                <HomeSlider slides={sliderInfo} shopName={shop} />
              )}
            </div>
          </section>
          <section className={styles.container}>
            <div
              className={styles.orderedComponent}
              style={{
                order: architecture.home.categoriesComponent.visibleIndex,
              }}
            >
              <XHr color={shopInfo.settings.secondaryColor} width="30%" />
              {loadingCategories ? (
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"150px"}
                  style={{ margin: "20px 0px" }}
                />
              ) : (
                <CategoriesGrid
                  architecture={architecture}
                  categories={categories}
                  shopName={shop}
                />
              )}
            </div>

            {loadingGallery ? (
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"60vh"}
                style={{ margin: "20px 0px" }}
              />
            ) : (
              <div
                className={styles.orderedComponent}
                style={{
                  order: galleryInfo.visibleIndex,
                }}
              >
                <XHr color={shopInfo.settings.secondaryColor} width="30%" />
                <XGallery
                  shopName={shopInfo.name}
                  content={galleryInfo.content}
                />
              </div>
            )}

            <div
              className={styles.orderedComponent}
              style={{
                order: architecture.home.discountComponent.visibleIndex,
              }}
            >
              <XHr color={shopInfo.settings.secondaryColor} width="30%" />
              {loadingDiscounts ? (
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
                  products={discounts}
                  activateControls={true}
                  title={"Get More For Less !"}
                  buttonAction={addTocart}
                />
              )}
            </div>
          </section>
        </ShopLayout>
      )}
    </>
  );
}

export default Shop;
