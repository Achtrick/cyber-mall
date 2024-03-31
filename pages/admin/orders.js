import { Check, Receipt } from "@mui/icons-material";
import { IconButton, Skeleton, Tooltip } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import AdminLayout from "../../components/admin/AdminLayout";
import { ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XHr from "../../components/ui-components/XHr";
import XModal from "../../components/ui-components/XModal";
import XPagination from "../../components/ui-components/XPagination";
import styles from "../../styles/admin/Dashboard.module.scss";
import { checkExpirity } from "../../utils/shared/checkExpirity";
import { getError } from "../../utils/shared/getError";
import {
  DeleteIcon,
  SearchIcon,
  VisibilityIcon,
} from "../../utils/theme/icons";

function Orders() {
  let executeSearchTimeout;

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const [title, setTitle] = useState("");

  const [order, setOrder] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const receiptRef = useRef();

  useEffect(() => {
    getOrders();
  }, [page, searchTerm]);

  const getOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/orders/get", {
        shop: userInfo.shop._id,
        page: page + 1,
        searchTerm: searchTerm,
      });
      setOrders(data.orders);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const cancelAction = () => {
    setAction("");
    setTitle("");
    setOrder(null);
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

  const closeOrder = async () => {
    try {
      const { data } = await axios.put("/api/admin/orders/close", {
        _id: order._id,
        products: order.products,
      });
      orders.find((o) => o._id === order._id).state = "CLOSED";
      enqueueSnackbar(data.message, { variant: "success" });
      cancelAction();
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const deleteOrder = async () => {
    try {
      const { data } = await axios.delete(
        `/api/admin/orders/delete/${order._id}`
      );
      setOrders(orders.filter((o) => o._id !== order._id));
      enqueueSnackbar(data.message, { variant: "success" });
      cancelAction();
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <XModal
          open={action !== ""}
          title={title}
          onClose={cancelAction}
          cancelAction={cancelAction}
          confirmAction={
            action === "CLOSE-ORDER"
              ? closeOrder
              : action === "DELETE-ORDER"
              ? deleteOrder
              : null
          }
          hideControls={action === "SHOW-ORDER"}
          size={action === "SHOW-ORDER" ? ModalSizes.BIG : ModalSizes.SMALL}
        >
          {action === "CLOSE-ORDER" ? (
            <>
              <p>
                êtes-vous sûr de clôturer la commande pour le client &apos;
                {order.user.firstName + " " + order.user.lastName}&apos; ?
              </p>
              <br />
            </>
          ) : action === "DELETE-ORDER" ? (
            <>
              <p>
                êtes-vous sûr de supprimer la commande pour le client &apos;
                {order.user.firstName + " " + order.user.lastName}&apos; ?
              </p>
              <br />
            </>
          ) : action === "SHOW-ORDER" ? (
            <>
              <div>
                <p>{order.user.firstName + " " + order.user.lastName}</p>
                <p>{order.user.phone}</p>
                <p>
                  {order.user.address +
                    " " +
                    order.user.city +
                    " " +
                    order.user.postalCode}
                </p>
              </div>
              <br />
              <table className="defaultTable">
                <thead>
                  <tr>
                    <th>image</th>
                    <th>désignation</th>
                    <th>prix</th>
                    <th>qté</th>
                    <th>total unitaire</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => {
                    return (
                      <tr key={product._id}>
                        <td data-label="image">
                          <img
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "contain",
                            }}
                            alt={product.designation}
                            src={
                              product.images[0]
                                ? `/api/images/${product.images[0]
                                    .split("/")
                                    .pop()}`
                                : "/images/image-placeholder.jpg"
                            }
                            onError={(e) => {
                              e.target.src = "/images/image-placeholder.jpg";
                            }}
                          />
                        </td>
                        <td data-label="désignation">{product.designation}</td>
                        <td data-label="prix">
                          {product.price.toLocaleString() + " DT"}
                        </td>
                        <td data-label="qté">{product.qty}</td>
                        <td data-label="total">
                          {(product.qty * product.price).toLocaleString() +
                            " DT"}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th colSpan={4}>TOTAL</th>
                    <th colSpan={1}>
                      {order.products
                        .reduce((sum, product) => {
                          return sum + product.price * product.qty;
                        }, 0)
                        .toLocaleString()}{" "}
                      DT{" "}
                      {order.products.reduce((sum, product) => {
                        return sum + product.price * product.qty;
                      }, 0) > userInfo.shop.freeShipping
                        ? ""
                        : "+ frais de livraison : " +
                          userInfo.shop.shippingFee +
                          "DT"}
                    </th>
                  </tr>
                </tbody>
              </table>
            </>
          ) : null}
        </XModal>
        <section className={styles.container}>
          <h1>Commandes</h1>
          <div className={styles.controls}>
            <XPagination
              color="secondary"
              page={page}
              count={count}
              onChange={onPaginationChange}
            />
            <div className="row" style={{ justifyContent: "flex-end" }}></div>
            <div className="row">
              <SearchIcon color="secondary" style={{ marginRight: "-30px" }} />
              <input
                style={{ paddingLeft: "30px" }}
                className="defaultInput"
                placeholder="Client"
                onChange={onSearchTermChange}
              />
            </div>
          </div>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 220px)"}
            />
          ) : (
            <section className="adminTableContainer">
              <table className="defaultTable">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Téléphone</th>
                    <th>Adresse</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Nbr Articles</th>
                    <th>État</th>
                    <th>actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    return (
                      <tr key={order._id}>
                        <td data-label="Client">
                          {order.user.firstName + " " + order.user.lastName}
                        </td>
                        <td data-label="Téléphone">{order.user.phone}</td>
                        <td data-label="Adresse">
                          {order.user.address +
                            " " +
                            order.user.city +
                            " " +
                            order.user.postalCode}
                        </td>
                        <td data-label="Date">
                          {moment(order.createdAt).format("DD-MM-YYYY")}
                        </td>
                        <td data-label="Total">
                          {order.products
                            .reduce((sum, product) => {
                              return sum + product.price * product.qty;
                            }, 0)
                            .toLocaleString() + " DT"}
                        </td>
                        <td data-label="Nbr Articles">
                          {order.products.reduce((count, product) => {
                            return count + product.qty;
                          }, 0)}
                        </td>
                        <td>
                          <p
                            className={
                              order.state === "WAITING"
                                ? styles.waiting
                                : styles.closed
                            }
                          >
                            {order.state === "WAITING"
                              ? "En Attente"
                              : "Clôturée"}
                          </p>
                        </td>
                        <td>
                          <div className="centered-row">
                            <Tooltip title="Voir Commande">
                              <IconButton
                                color="info"
                                onClick={() => {
                                  setOrder(order);
                                  setAction("SHOW-ORDER");
                                  setTitle("Aperçu de la commande");
                                }}
                              >
                                <VisibilityIcon sx={{ width: "20px" }} />
                              </IconButton>
                            </Tooltip>
                            {order.state === "WAITING" ? (
                              <Tooltip title="Clôturer">
                                <IconButton
                                  color="info"
                                  onClick={() => {
                                    setOrder(order);
                                    setAction("CLOSE-ORDER");
                                    setTitle("Clôturer La Commande");
                                  }}
                                >
                                  <Check sx={{ width: "20px" }} />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                            {order.state === "CLOSED" ? (
                              userInfo?.shop.pack.type === "PREMIUM" ? (
                                <ReactToPrint
                                  onBeforeGetContent={async () => {
                                    setOrder(order);
                                    await new Promise((resolve) => {
                                      setTimeout(resolve, 0);
                                    });
                                  }}
                                  trigger={() => (
                                    <Tooltip title="Imprimer">
                                      <IconButton color="info">
                                        <Receipt sx={{ width: "20px" }} />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  content={() => receiptRef.current}
                                />
                              ) : (
                                <Tooltip title="Imprimer">
                                  <IconButton
                                    onClick={() =>
                                      enqueueSnackbar(
                                        "Passez à PREMIUM pour bénéficier de cette fonctionnalité !",
                                        { variant: "warning" }
                                      )
                                    }
                                    color="info"
                                  >
                                    <Receipt sx={{ width: "20px" }} />
                                  </IconButton>
                                </Tooltip>
                              )
                            ) : null}
                            <Tooltip title="Supprimer">
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setOrder(order);
                                  setAction("DELETE-ORDER");
                                  setTitle("Supprimer la commande");
                                }}
                              >
                                <DeleteIcon sx={{ width: "20px" }} />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}
        </section>

        <section ref={receiptRef} className={styles.receipt}>
          {order && userInfo && (
            <>
              <div className="row">
                <img
                  src={`/api/images/${userInfo.shop.logo.split("/").pop()}`}
                  onError={(e) => {
                    e.target.src = "/images/default-store.png";
                  }}
                />
              </div>
              <br />
              <br />
              <div className={styles.row}>
                <div>
                  <p>{userInfo.shop.name}</p>
                  <p>{userInfo.shop.architecture.contact.address}</p>
                  <p>{userInfo.shop.architecture.contact.direct.phone}</p>
                  <p>{userInfo.shop.architecture.contact.direct.email}</p>
                </div>
                <div>
                  <p>{order.user.firstName + " " + order.user.lastName}</p>
                  <p>{order.user.phone}</p>
                  <p>
                    {order.user.address +
                      " " +
                      order.user.city +
                      " " +
                      order.user.postalCode}
                  </p>
                </div>
              </div>
              <XHr color={userInfo.shop.settings.secondaryColor} />
              <table className="fixedTable">
                <thead>
                  <tr>
                    <th>désignation</th>
                    <th>prix</th>
                    <th>qté</th>
                    <th>total unitaire</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => {
                    return (
                      <tr key={product._id}>
                        <td>{product.designation}</td>
                        <td>{product.price.toLocaleString() + " DT"}</td>
                        <td>{product.qty}</td>
                        <td>
                          {(product.qty * product.price).toLocaleString() +
                            " DT"}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th colSpan={3}>TOTAL</th>
                    <th colSpan={1}>
                      {order.products &&
                        order.products
                          .reduce((sum, product) => {
                            return sum + product.price * product.qty;
                          }, 0)
                          .toLocaleString()}{" "}
                      DT{" "}
                      {order.products.reduce((sum, product) => {
                        return sum + product.price * product.qty;
                      }, 0) > userInfo.shop.freeShipping
                        ? ""
                        : "+ frais de livraison : " +
                          userInfo.shop.shippingFee +
                          "DT"}
                    </th>
                  </tr>
                </tbody>
              </table>
              <br />
              <div className={styles.row}>
                <p></p>
                <p>créé à: {moment().format("DD-MM-YYYY")}</p>
              </div>
            </>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Orders;
