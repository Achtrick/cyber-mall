import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/shop/LoadingScreen";
import axios from "axios";
import ShopLayout from "../../components/shop/ShopLayout";

function Shop(props) {
  const router = useRouter();
  const { shopName } = router.query;

  const [loading, setLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState({});

  useEffect(() => {
    if (shopName) getShopInfo();
  }, [shopName]);

  const getShopInfo = async () => {
    try {
      const { data } = await axios.post("api/shop/getInfo", {
        shopName: shopName,
      });

      setShopInfo(data);
      setLoading(false);
    } catch (error) {
      router.push("/");
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout shopInfo={shopInfo}>
          <div>page content</div>
        </ShopLayout>
      )}
    </>
  );
}

export default Shop;
