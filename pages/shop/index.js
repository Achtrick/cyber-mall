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
import DiscountsSection from "../../components/shop/DiscountsSection";

function Shop(props) {
  const router = useRouter();
  const { shopName } = router.query;
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);

  const [shopInfo, setShopInfo] = useState({});
  const [architecture, setArchitecture] = useState({});
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    if (shopName) getShopInfo();
  }, [shopName]);

  const getShopInfo = async () => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: shopName,
      });

      setShopInfo(data);
      setArchitecture(data.architecture);
      setLoading(false);

      !categories.length && (await getCategories(data._id));
      !discounts.length && (await getDiscounts(data._id));
    } catch (error) {
      console.log(error);
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

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout shopInfo={shopInfo}>
          <section className={styles.container}>
            <div style={{ marginBottom: "20px", width: "100%" }}>
              <HomeSlider slides={architecture.home.sliderComponent} />
            </div>

            <div
              className={styles.orderedComponent}
              style={{
                order: architecture.home.categoriesComponent.visibleIndex,
              }}
            >
              <XHr color={shopInfo.settings.secondaryColor} width="80%" />
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
                />
              )}
            </div>
            <div
              className={styles.orderedComponent}
              style={{
                order: architecture.home.galleryComponent.visibleIndex,
              }}
            >
              <XHr color={shopInfo.settings.secondaryColor} width="80%" />

              <XGallery content={architecture.home.galleryComponent.content} />
            </div>
            <div
              className={styles.orderedComponent}
              style={{
                order: architecture.home.discountComponent.visibleIndex,
              }}
            >
              <XHr color={shopInfo.settings.secondaryColor} width="80%" />
              {loadingDiscounts ? (
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"150px"}
                  style={{ margin: "20px 0px" }}
                />
              ) : (
                <DiscountsSection
                  settings={shopInfo.settings}
                  shopName={shopInfo.name}
                  discounts={discounts}
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
