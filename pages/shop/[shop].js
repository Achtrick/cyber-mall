import { Skeleton } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CategoriesGrid from "../../components/shop/CategoriesGrid";
import HomeSlider from "../../components/shop/HomeSlider";
import LoadingScreen from "../../components/shop/LoadingScreen";
import ProductsSlider from "../../components/shop/ProductsSlider";
import ShopLayout from "../../components/shop/ShopLayout";
import XGallery from "../../components/ui-components/XGallery";
import XGridSkeleton from "../../components/ui-components/XGridSkeleton";
import XHr from "../../components/ui-components/XHr";
import styles from "../../styles/shop/Index.module.scss";
import { calculateDiscount } from "../../utils/config/convertHelper";
import { getError } from "../../utils/shared/getError";

function Shop({ shop }) {
  const router = useRouter();
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
    if (shop) {
      getShopInfo();
    } else {
      enqueueSnackbar("Lien de shop invalide", { variant: "error" });
      router.push("/");
    }
  }, []);

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
    dispatch({ type: "TOGGLE_CART_PREVIEW" });
    enqueueSnackbar(`${product.designation} Ajouté au panier`, {
      variant: "info",
    });
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout
          shopInfo={shopInfo}
          description={shopInfo.architecture.about}
        >
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
                <HomeSlider
                  slides={
                    sliderInfo.length
                      ? sliderInfo
                      : [
                          {
                            link: "",
                            image: "slider-placeholder.jpg",
                          },
                        ]
                  }
                  shopName={shop}
                />
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
              ) : categories.length ? (
                <CategoriesGrid
                  categories={
                    shopInfo.pack.type !== "PREMIUM"
                      ? categories.slice(0, 5)
                      : categories
                  }
                  architecture={architecture}
                  shopName={shop}
                />
              ) : (
                <XGridSkeleton title={"Découvrir Nos Catégories"} />
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
              ) : discounts.length ? (
                <ProductsSlider
                  shopInfo={shopInfo}
                  products={discounts}
                  activateControls={true}
                  title={"Obtenez plus pour moins cher !"}
                  buttonAction={addTocart}
                />
              ) : (
                <XGridSkeleton title={"Obtenez plus pour moins cher !"} />
              )}
            </div>
          </section>
        </ShopLayout>
      )}
    </>
  );
}

export default Shop;

export function getServerSideProps(context) {
  return {
    props: { shop: context.params.shop },
  };
}
