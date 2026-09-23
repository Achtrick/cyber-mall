import { Skeleton } from "@mui/material";
import axios from "axios";
import EmptyState from "../../components/ui-components/EmptyState";
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
import { SearchIcon } from "../../utils/theme/icons";

function Orders() {
  let executeSearchTimeout;

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCloseOrder, setLoadingCloseOrder] = useState(false);
  const [loadingDeleteOrder, setLoadingDeleteOrder] = useState(false);
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
    setLoadingCloseOrder(true);
    try {
      const { data } = await axios.put("/api/admin/orders/close", {
        _id: order._id,
        products: order.products,
      });
      orders.find((o) => o._id === order._id).state = "CLOSED";
      enqueueSnackbar(data.message, { variant: "success" });
      cancelAction();
      setLoadingCloseOrder(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingCloseOrder(false);
    }
  };

  const deleteOrder = async () => {
    setLoadingDeleteOrder(true);
    try {
      const { data } = await axios.delete(
        `/api/admin/orders/delete/${order._id}`
      );
      setOrders(orders.filter((o) => o._id !== order._id));
      enqueueSnackbar(data.message, { variant: "success" });
      cancelAction();
      setLoadingDeleteOrder(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingDeleteOrder(false);
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
          loading={
            action === "CLOSE-ORDER"
              ? loadingCloseOrder
              : action === "DELETE-ORDER"
              ? loadingDeleteOrder
              : null
          }
          hideControls={action === "SHOW-ORDER"}
          size={action === "SHOW-ORDER" ? ModalSizes.BIG : ModalSizes.SMALL}
        >
          {action === "CLOSE-ORDER" ? (
            <>
              <p>
                are you sure you want to confirm the order for the customer &apos;
                {order.user.firstName + " " + order.user.lastName}&apos; ?
              </p>
              <br />
            </>
          ) : action === "DELETE-ORDER" ? (
            <>
              <p>
                are you sure you want to delete the order for the customer &apos;
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
              <table className="defaultTable" style={{ overflow: "hidden" }}>
                <thead>
                  <tr>
                    <th>image</th>
                    <th>designation</th>
                    <th>price</th>
                    <th>qty</th>
                    <th>unit total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, key) => {
                    return (
                      <tr key={key}>
                        <td data-label="image">
                          <img
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "contain",
                            }}
                            alt={product.designation}
                            src={
                              product.images[0]
                                ? `/api/images/${product.images[0]
                                    .split("/")
                                    .pop()}?width=200&height=200`
                                : "/images/image-placeholder.jpg"
                            }
                            onError={(e) => {
                              e.target.src = "/images/image-placeholder.jpg";
                            }}
                          />
                        </td>
                        <td data-label="designation">{product.designation}</td>
                        <td data-label="price">
                          {product.price.toLocaleString() +
                            " " +
                            userInfo.shop.currency}
                        </td>
                        <td data-label="qty">{product.qty}</td>
                        <td data-label="total">
                          {(product.qty * product.price).toLocaleString() +
                            " " +
                            userInfo.shop.currency}
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
                      {userInfo.shop.currency}{" "}
                      {order.products.reduce((sum, product) => {
                        return sum + product.price * product.qty;
                      }, 0) > userInfo.shop.freeShipping
                        ? ""
                        : "+ shipping fee : " +
                          userInfo.shop.shippingFee +
                          +" " +
                          userInfo.shop.currency}
                    </th>
                  </tr>
                </tbody>
              </table>
              <div className="btn-group" style={{ justifyContent: "flex-end", marginTop: "16px" }}>
                <button className="btn" onClick={cancelAction}>
                  Close
                </button>
                {order.state === "WAITING" ? (
                  <button
                    className="btn btn-success"
                    disabled={loadingCloseOrder}
                    onClick={closeOrder}
                  >
                    {loadingCloseOrder ? "Confirming..." : "Confirm order"}
                  </button>
                ) : (
                  <span className="pill">Order confirmed</span>
                )}
              </div>
            </>
          ) : null}
        </XModal>
        <section className={styles.container}>
          <h1>Orders</h1>
          <div className={styles.controls}>
            <XPagination
              color="secondary"
              page={page}
              count={count}
              onChange={onPaginationChange}
            />
            <div className={styles.searchBox}>
              <SearchIcon />
              <input
                className="defaultInput"
                placeholder="Customer"
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
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    return (
                      <tr key={order._id}>
                        <td data-label="Customer">
                          {order.user.firstName + " " + order.user.lastName}
                        </td>
                        <td data-label="Phone">{order.user.phone}</td>
                        <td data-label="Address">
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
                            .toLocaleString() +
                            " " +
                            userInfo.shop.currency}
                        </td>
                        <td data-label="Items">
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
                              ? "Pending"
                              : "Closed"}
                          </p>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm"
                              onClick={() => {
                                setOrder(order);
                                setAction("SHOW-ORDER");
                                setTitle("Order preview");
                              }}
                            >
                              View
                            </button>
                            {order.state === "WAITING" ? (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => {
                                  setOrder(order);
                                  setAction("CLOSE-ORDER");
                                  setTitle("Confirm the order");
                                }}
                              >
                                Confirm
                              </button>
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
                                    <button className="btn btn-sm">Print</button>
                                  )}
                                  content={() => receiptRef.current}
                                />
                              ) : (
                                <button
                                  className="btn btn-sm"
                                  onClick={() =>
                                    enqueueSnackbar(
                                      "Upgrade to PREMIUM to benefit from this feature!",
                                      { variant: "warning" }
                                    )
                                  }
                                >
                                  Print
                                </button>
                              )
                            ) : null}
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                setOrder(order);
                                setAction("DELETE-ORDER");
                                setTitle("Delete the order");
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!orders.length ? (
                <EmptyState
                  art="cart"
                  title="No orders yet"
                  text="New orders from your shop will appear here."
                />
              ) : null}
            </section>
          )}
        </section>

        <section ref={receiptRef} className={styles.receipt}>
          {order && userInfo && (
            <>
              <div
                className="row"
                style={{ justifyContent: "flex-start", width: "100%" }}
              >
                <img
                  alt="shop logo"
                  src={
                    userInfo.shop.logo.length
                      ? `/api/images/${userInfo.shop.logo
                          .split("/")
                          .pop()}?width=100&height=100`
                      : "/cyber-mall.png"
                  }
                  onError={(e) => {
                    e.target.src = "/cyber-mall.png";
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
                    <th>designation</th>
                    <th>price</th>
                    <th>qty</th>
                    <th>unit total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, key) => {
                    return (
                      <tr key={key}>
                        <td>{product.designation}</td>
                        <td>
                          {product.price.toLocaleString() +
                            " " +
                            userInfo.shop.currency}
                        </td>
                        <td>{product.qty}</td>
                        <td>
                          {(product.qty * product.price).toLocaleString() +
                            " " +
                            userInfo.shop.currency}
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
                      {userInfo.shop.currency}{" "}
                      {order.products.reduce((sum, product) => {
                        return sum + product.price * product.qty;
                      }, 0) > userInfo.shop.freeShipping
                        ? ""
                        : "+ shipping fee : " +
                          userInfo.shop.shippingFee +
                          " " +
                          userInfo.shop.currency}
                    </th>
                  </tr>
                </tbody>
              </table>
              <br />
              <div className={styles.row}>
                <p></p>
                <p>created at: {moment().format("DD-MM-YYYY")}</p>
              </div>
            </>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Orders;
