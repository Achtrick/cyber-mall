import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/shop/LoadingScreen";
import axios from "axios";
import ShopLayout from "../../components/shop/ShopLayout";

function Shop(props) {
  const router = useRouter();
  const { shopName } = router.query;

  const [loading, setLoading] = useState(true);
  const [shopSettings, setShopSettings] = useState({});

  useEffect(() => {
    if (shopName) getShopSettings();
  }, [shopName]);

  const getShopSettings = async () => {
    try {
      const { data } = await axios.post("api/shop/getSettings", {
        shopName: shopName,
      });
      setShopSettings(data);
      setLoading(false);
    } catch (error) {
      router.push("/");
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout shopSettings={shopSettings.settings}>
          <div>page content</div>
        </ShopLayout>
      )}
    </>
  );
}

export default Shop;
