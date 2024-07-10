import SearchIcon from "@mui/icons-material/Search";
import { Skeleton } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import SuperAdminLayout from "../../components/super-admin/SuperAdminLayout";
import XButton from "../../components/ui-components/XButton";
import XModal from "../../components/ui-components/XModal";
import XPagination from "../../components/ui-components/XPagination";
import styles from "../../styles/SuperAdmin.module.scss";
import { getError } from "../../utils/shared/getError";

export default function Shops(props) {
  let executeSearchTimeout;

  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [domainName, setDomainName] = useState("");
  const [action, setAction] = useState("");
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

  const updateDomainName = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/super-admin/update-domain-name", {
        shopId: shopId,
        domainName: domainName,
      });
      setLoading(false);
      cancelAction();
      enqueueSnackbar(data.message, { variant: "info" });
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const deleteShop = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/super-admin/delete-shop", {
        shopId: shopId,
      });
      setShops(shops.filter((s) => s._id !== shopId));
      setLoading(false);
      cancelAction();
      enqueueSnackbar(data.message, { variant: "info" });
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const cancelAction = () => {
    setDomainName("");
    setAction("");
    setShopId(null);
  };

  return (
    <DisconnectedGuard>
      <XModal
        loading={loading}
        open={action.length}
        onClose={cancelAction}
        formId={action === "DOMAIN" ? "domain_name_form" : null}
        cancelAction={cancelAction}
        confirmAction={action === "DELETE" ? deleteShop : null}
        size={ModalSizes.SMALL}
        title={
          action === "DOMAIN"
            ? "Modifier le nom de domaine"
            : action === "DELETE"
            ? `Supprimer le shop: ${
                shops.find((_) => _._id === shopId).name
              } ?!`
            : null
        }
      >
        <>
          {action === "DOMAIN" ? (
            <form id="domain_name_form" onSubmit={updateDomainName}>
              <div className="labeledInput">
                <label>Nouveau Nom de domaine (sans www)</label>
                <input
                  type="text"
                  className="defaultInput"
                  required
                  onChange={(e) => setDomainName(e.target.value)}
                />
              </div>
            </form>
          ) : action === "DELETE" ? (
            <></>
          ) : null}
        </>
      </XModal>
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
                          <img
                            alt="logo"
                            src={`/api/images/${shop.logo.split("/").pop()}`}
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
                      <h1>{shop.user.firstName + " " + shop.user.lastName}</h1>
                      <h1>{shop.user.email}</h1>
                      <h1>{shop.user.phone}</h1>
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
                      </p>{" "}
                      {shop.domainName.length ? (
                        <p>Domain name: {shop.domainName}</p>
                      ) : null}
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
                        {shop.pack.type !== "FREE" && (
                          <>
                            &nbsp;
                            <XButton
                              color="turquoise"
                              text="domain name"
                              action={() => {
                                setShopId(shop._id);
                                setAction("DOMAIN");
                              }}
                            ></XButton>
                          </>
                        )}
                        &nbsp;
                        <XButton
                          color={shop.banned ? "violet" : "orange"}
                          text={shop.banned ? "activate" : "bann"}
                          action={() => toggleBann(shop._id)}
                        ></XButton>
                        &nbsp;
                        <XButton
                          color="red"
                          text="delete"
                          action={() => {
                            setShopId(shop._id);
                            setAction("DELETE");
                          }}
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
