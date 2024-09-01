import { AccountCircle } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { LinearProgress, Skeleton } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import SuperAdminLayout from "../../components/super-admin/SuperAdminLayout";
import XButton from "../../components/ui-components/XButton";
import XPagination from "../../components/ui-components/XPagination";
import styles from "../../styles/SuperAdmin.module.scss";
import { getError } from "../../utils/shared/getError";

export default function Demands(props) {
  let executeSearchTimeout;

  const offers = [
    { period: "1 Mois", price: 30 },
    { period: "3 Mois", price: 85 },
    { period: "6 Mois", price: 160 },
    { period: "12 Mois", price: 300 },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingUpgrade, setLoadingUpgrade] = useState("");
  const [demands, setDemands] = useState([]);

  useEffect(() => {
    getDemands();
  }, [page, searchTerm]);

  const getDemands = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/super-admin/get-premium-demands",
        {
          page: page + 1,
          searchTerm: searchTerm,
        }
      );
      setDemands(data.demands);
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

  const upgradeShop = async (shopId, demandId, period) => {
    setLoadingUpgrade(demandId);
    try {
      const { data } = await axios.put("/api/super-admin/upgrade-shop", {
        shopId: shopId,
        demandId: demandId,
        period: period,
      });
      setDemands([...demands.filter((d) => d._id !== demandId)]);
      enqueueSnackbar(data.message, { variant: "info" });
      setLoadingUpgrade("");
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingUpgrade("");
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
              placeholder="user name ..."
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
                {demands.map((demand) => {
                  return (
                    <div
                      key={demand._id}
                      className={`${styles.shopCard} + ${
                        demand.shop.pack.type === "FREE"
                          ? styles.silver
                          : styles.gold
                      }`}
                    >
                      <AccountCircle sx={{ width: "45px", height: "45px" }} />
                      <h1>{demand.userName}</h1>
                      <p>{demand.phone}</p>
                      <p>{demand.address}</p>
                      <div
                        className="row"
                        style={{ justifyContent: "space-between" }}
                      >
                        <h1>{demand.shop.name}</h1>
                        {demand.shop.logo ? (
                          <img
                            alt="logo"
                            src={`/api/images/${demand.shop.logo
                              .split("/")
                              .pop()}`}
                            onError={(e) => {
                              e.target.src = "/cyber-mall.png";
                            }}
                            width={"50"}
                            height={"50"}
                            style={{ objectFit: "contain" }}
                          />
                        ) : (
                          <img
                            alt="logo"
                            src={"/cyber-mall.png"}
                            width={"50"}
                            height={"50"}
                            style={{ objectFit: "contain" }}
                          />
                        )}
                      </div>
                      <h4>Order number: {demand.orderNumber}</h4>
                      <h4>
                        Requested Pack: {demand.period} for{" "}
                        {offers.find((o) => o.period === demand.period).price}
                      </h4>
                      <LinearProgress />
                      <br />
                      <p>
                        Status:{" "}
                        <span
                          className={
                            demand.shop.banned ? styles.error : styles.success
                          }
                        >
                          {demand.shop.banned ? "Banned" : "Active"}
                        </span>
                      </p>
                      <p>Pack: {demand.shop.pack.type}</p>
                      {demand.shop.pack.type !== "FREE" && (
                        <p>
                          Expires in:{" "}
                          {moment(demand.shop.pack.expiresIn).format(
                            "DD-MM-YYYY"
                          )}
                        </p>
                      )}
                      <div className={styles.controls}>
                        <XButton
                          color="#37a237"
                          text="upgrade"
                          action={() =>
                            upgradeShop(
                              demand.shop._id,
                              demand._id,
                              demand.period
                            )
                          }
                          loading={loadingUpgrade === demand._id}
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
