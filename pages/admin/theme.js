import { CircularProgress, IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XBadge from "../../components/ui-components/XBadge";
import XButton from "../../components/ui-components/XButton";
import XHr from "../../components/ui-components/XHr";
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";
import themeStyles from "../../styles/admin/Theme.module.scss";
import { deduceColor } from "../../utils/config/convertHelper";
import { checkExpirity } from "../../utils/shared/checkExpirity";
import { getError } from "../../utils/shared/getError";
import { ShoppingCartIcon } from "../../utils/theme/icons";
function Theme(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState({});

  const [action, setAction] = useState("");
  const [title, setTitle] = useState("");
  const [copiedColor, setCopiedColor] = useState(null);

  const [colors, setColors] = useState({
    headerColor: "",
    footerColor: "",
    primaryColor: "",
    secondaryColor: "",
  });
  const [currentColor, setCurrentColor] = useState(null);

  useEffect(() => {
    getShopInfo();
  }, []);

  const getShopInfo = async (load = true) => {
    load && setLoading(true);
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: userInfo.shop.name,
      });

      setShopInfo(data);
      setColors(data.settings);
      setLoading(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const closeAction = () => {
    setTitle("");
    setAction("");
  };

  const updateColors = (e) => {
    setColors({ ...colors, [e.target.name]: e.target.value });
  };

  const saveSettings = async () => {
    try {
      const { data } = await axios.post("/api/admin/shop/update-theme", {
        shopId: shopInfo._id,
        settings: colors,
      });

      enqueueSnackbar(data.message, { variant: "success" });
      getShopInfo(false);
      setAction("");
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const handleColorCopyPaste = async (color) => {
    if (copiedColor) {
      setColors({ ...colors, [color]: copiedColor });
      await axios.post("/api/admin/shop/update-theme", {
        shopId: shopInfo._id,
        settings: { ...colors, [color]: copiedColor },
      });
      setCopiedColor(null);
      enqueueSnackbar("Color applied", {
        variant: "info",
      });
    } else {
      setCopiedColor(colors[color]);
      enqueueSnackbar("Color copied", {
        variant: "info",
      });
    }
  };

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <XModal
          open={action !== ""}
          title={title}
          onClose={closeAction}
          cancelAction={closeAction}
          confirmAction={saveSettings}
          size={ModalSizes.SMALL}
        >
          <div className={styles.modal}>
            <form>
              <input
                name={currentColor}
                value={colors[currentColor]}
                onChange={updateColors}
                type="color"
                style={{
                  backgroundColor: "transparent",
                  width: "100%",
                  height: "50px",
                }}
              />
            </form>
          </div>
        </XModal>
        <section className={styles.container}>
          <div className={styles.controls} style={{ justifyContent: "center" }}>
            <h1>Theme</h1>
          </div>
          <p>
            use the Change color buttons below to edit each color
          </p>

          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 250px)"}
            />
          ) : (
            <section>
              <div className={themeStyles.pagePreview}>
                <div
                  className={themeStyles.headerPreview}
                  style={{
                    backgroundColor: colors.headerColor,
                    border: `1px solid ${deduceColor(colors.headerColor)}`,
                    color: deduceColor(colors.headerColor),
                  }}
                >
                  this is what your navigation bar will look like
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                        setTitle("change the header color");
                        setCurrentColor("headerColor");
                        setAction(AdminActions.UPDATE);
                      }}
                  >
                    Change color
                  </button>{" "}
                  |{" "}
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      handleColorCopyPaste("headerColor");
                    }}
                  >
                    {copiedColor ? "Apply copied color" : "Copy color"}
                  </button>
                </div>
                <br />
                <div className={themeStyles.bodyPreview}>
                  <p>the main color will look like this:</p>
                  <br />
                  <div className="row" style={{ justifyContent: "flex-start" }}>
                    <div
                      className={themeStyles.primaryColor}
                      style={{
                        backgroundColor: colors.primaryColor,
                      }}
                    />
                    <button
                    className="btn btn-sm"
                    onClick={() => {
                          setTitle("change the primary color");
                          setCurrentColor("primaryColor");
                          setAction(AdminActions.UPDATE);
                        }}
                  >
                    Change color
                  </button>
                    |{" "}
                    <button
                    className="btn btn-sm"
                    onClick={() => {
                      handleColorCopyPaste("primaryColor");
                    }}
                  >
                    {copiedColor ? "Apply copied color" : "Copy color"}
                  </button>
                  </div>
                  <br />
                  <p>the controls will look like this:</p>
                  <br />
                  <div className="row" style={{ justifyContent: "flex-start" }}>
                    <XButton text="action" color={colors.primaryColor} />
                    &nbsp;
                    <XBadge color={colors.primaryColor} content={5}>
                      <IconButton
                        color={deduceColor(shopInfo.settings.headerColor)}
                      >
                        <ShoppingCartIcon />
                      </IconButton>
                    </XBadge>
                    &nbsp;
                    <CircularProgress
                      size={"22px"}
                      style={{ marginLeft: "10px", color: colors.primaryColor }}
                    />
                  </div>
                  <br />
                  <p>the secondary color will look like this:</p>
                  <br />
                  <div className="row" style={{ justifyContent: "flex-start" }}>
                    <div
                      className={themeStyles.secondaryColor}
                      style={{
                        backgroundColor: colors.secondaryColor,
                      }}
                    />
                    <button
                    className="btn btn-sm"
                    onClick={() => {
                          setTitle("change the secondary color");
                          setCurrentColor("secondaryColor");
                          setAction(AdminActions.UPDATE);
                        }}
                  >
                    Change color
                  </button>
                    |{" "}
                    <button
                    className="btn btn-sm"
                    onClick={() => {
                      handleColorCopyPaste("secondaryColor");
                    }}
                  >
                    {copiedColor ? "Apply copied color" : "Copy color"}
                  </button>
                  </div>
                  <br />
                  <p>the accents will look like this</p>
                  <br />
                  <div className="row" style={{ justifyContent: "flex-start" }}>
                    <XHr color={colors.secondaryColor} />
                  </div>
                </div>
                <br />
                <br />
                <div
                  className={themeStyles.footerPreview}
                  style={{
                    backgroundColor: colors.footerColor,
                    color: deduceColor(colors.footerColor),
                    border: `1px solid ${deduceColor(colors.footerColor)}`,
                  }}
                >
                  this is what your footer will look like
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                        setTitle("change the footer color");
                        setCurrentColor("footerColor");
                        setAction(AdminActions.UPDATE);
                      }}
                  >
                    Change color
                  </button>
                  |{" "}
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      handleColorCopyPaste("footerColor");
                    }}
                  >
                    {copiedColor ? "Apply copied color" : "Copy color"}
                  </button>
                </div>
              </div>
            </section>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Theme;
