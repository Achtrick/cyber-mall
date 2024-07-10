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
      const { data } = await axios.post("/api/super-admin/get-domain-demands", {
        page: page + 1,
        searchTerm: searchTerm,
      });
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

  const upgradeShop = async (shopId, demandId, domainName) => {
    setLoadingUpgrade(demandId);
    try {
      const { data } = await axios.post("/api/super-admin/update-domain-name", {
        shopId: shopId,
        domainName: domainName,
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
                      <h4>Requested Domain Name: {demand.domainName}</h4>
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
                          text="confirm new domain"
                          action={() =>
                            upgradeShop(
                              demand.shop._id,
                              demand._id,
                              demand.domainName
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
