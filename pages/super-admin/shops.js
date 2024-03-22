import SearchIcon from "@mui/icons-material/Search";
import { Skeleton } from "@mui/material";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import SuperAdminLayout from "../../components/super-admin/SuperAdminLayout";
import XButton from "../../components/ui-components/XButton";
import XPagination from "../../components/ui-components/XPagination";
import styles from "../../styles/SuperAdmin.module.scss";
import { getError } from "../../utils/shared/getError";

export default function Shops(props) {
  let executeSearchTimeout;

  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    getShops();
  }, [page, searchTerm]);

  const getShops = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/super-admin/get-shops", {
        page: page + 1,
        searchTerm: searchTerm,
      });
      setShops(data.shops);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const onPaginationChange = (e, page) => {
    setPage(page - 1);
  };

  const onSearchTermChange = (e) => {
    clearTimeout(executeSearchTimeout);
    executeSearchTimeout = setTimeout(() => {
      setSearchTerm(e.target.value);
    }, 600);
  };

  const toggleBann = async (_id) => {
    try {
      const { data } = await axios.put("/api/super-admin/toggle-shop-bann", {
        _id: _id,
      });
      shops.find((s) => s._id === _id).banned = !shops.find(
        (s) => s._id === _id
      ).banned;
      setShops([...shops]);
      enqueueSnackbar(data.message, { variant: "info" });
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const downgradeShop = async (shopId) => {
    try {
      const { data } = await axios.put("/api/super-admin/downgrade-shop", {
        shopId: shopId,
      });
      shops.find((s) => s._id === shopId).pack = {
        type: "FREE",
        expiresIn: "",
      };
      setShops([...shops]);
      enqueueSnackbar(data.message, { variant: "info" });
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  return (
    <DisconnectedGuard>
      <SuperAdminLayout>
        <section>
          <div className={styles.searchField}>
            <SearchIcon
              sx={{ marginRight: "-25px", color: "#050b14", zIndex: "1" }}
            />
            <input
              type="text"
              style={{ paddingLeft: "30px" }}
              placeholder="shop name ..."
              onChange={onSearchTermChange}
            />
          </div>
          <br />
          <XPagination
            color="secondary"
            page={page}
            count={count}
            onChange={onPaginationChange}
          />
          <br />
          <div className={styles.arena}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ backgroundColor: "#101629" }}
              />
            ) : (
              <>
                {shops.map((shop) => {
                  return (
                    <div
                      key={shop._id}
                      className={`${styles.shopCard} + ${
                        shop.pack.type === "FREE" ? styles.silver : styles.gold
                      }`}
                    >
                      <div
                        className="row"
                        style={{ justifyContent: "space-between" }}
                      >
                        <h1>{shop.name}</h1>
                        {shop.logo ? (
                          <Image
                            alt="logo"
                            src={shop.logo}
                            onError={() => {
                              setLogo("/images/default-store.png");
                            }}
                            width={"50"}
                            height={"50"}
                            style={{ objectFit: "contain" }}
                          />
                        ) : (
                          <Image
                            alt="logo"
                            src={"/images/default-store.png"}
                            width={"50"}
                            height={"50"}
                            style={{ objectFit: "contain" }}
                          />
                        )}
                      </div>
                      <hr />
                      <p>
                        Status:{" "}
                        <span
                          className={
                            shop.banned ? styles.error : styles.success
                          }
                        >
                          {shop.banned ? "Banned" : "Active"}
                        </span>
                      </p>
                      <p>Pack: {shop.pack.type}</p>
                      {shop.pack.type !== "FREE" && (
                        <p>
                          Expires in:{" "}
                          {moment(shop.pack.expiresIn).format("DD-MM-YYYY")}
                        </p>
                      )}
                      <div className={styles.controls}>
                        {shop.pack.expiresIn !== "" &&
                          moment(shop.pack.expiresIn).isBefore(
                            moment().subtract(1, "day")
                          ) && (
                            <XButton
                              color="#c52222"
                              text="downgrade"
                              action={() => downgradeShop(shop._id)}
                            ></XButton>
                          )}
                        &nbsp;
                        <XButton
                          color={shop.banned ? "#37a237" : "#c52222"}
                          text={shop.banned ? "activate" : "bann"}
                          action={() => toggleBann(shop._id)}
                        ></XButton>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <br />
          <XPagination
            color="secondary"
            page={page}
            count={count}
            onChange={onPaginationChange}
          />
        </section>
      </SuperAdminLayout>
    </DisconnectedGuard>
  );
}
