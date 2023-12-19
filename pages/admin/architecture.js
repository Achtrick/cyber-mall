import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import styles from "../../styles/admin/Dashboard.module.scss";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import HomeSlider from "../../components/shop/HomeSlider";
import { SettingsIcon } from "../../utils/theme/icons";

function Architecture(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState({});
  const [categories, setCategories] = useState({});

  useEffect(() => {
    getShopInfo();
    getCategories();
  }, []);

  const getShopInfo = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: userInfo.shop.name,
      });
      setShopInfo(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.post("/api/admin/categories/get", {
        shop: userInfo.shop._id,
      });
      setCategories(data);
      console.log(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <section className={styles.container}>
          <h1>Configure your shop to your taste</h1>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 150px)"}
            />
          ) : (
            <div className={styles.container}>
              <h1>Home Page</h1>
              <p>
                - slider (recommended resolution is 1004 x 950){" "}
                <IconButton color="info">
                  <SettingsIcon />
                </IconButton>
              </p>
              <HomeSlider
                slides={
                  shopInfo?.architecture?.home?.sliderComponent ?? [
                    {
                      link: "text",
                      image: "/images/image-placeholder.jpg",
                    },
                  ]
                }
              />
            </div>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Architecture;
