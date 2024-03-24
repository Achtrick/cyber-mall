import { CircularProgress, IconButton, Skeleton, Tooltip } from "@mui/material";
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
import {
  CheckCircleIcon,
  PaletteIcon,
  ShoppingCartIcon,
} from "../../utils/theme/icons";

function Theme(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState({});

  const [action, setAction] = useState("");
  const [title, setTitle] = useState("");

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

  const getShopInfo = async () => {
    setLoading(true);
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
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/shop/update-theme", {
        shopId: shopInfo._id,
        settings: colors,
      });

      enqueueSnackbar(data.message, { variant: "success" });
      getShopInfo();
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
          onClose={closeAction}
          cancelAction={closeAction}
          size={ModalSizes.SMALL}
          hideControls={true}
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
                  width: "50%",
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
            - click on the{" "}
            <IconButton disabled>
              <PaletteIcon color="warning" />
            </IconButton>{" "}
            to change appearance
          </p>
          <p>
            - when you finish click here to save your settings{" "}
            {loading ? (
              <IconButton>
                <CircularProgress color="black" size={"22px"} />
              </IconButton>
            ) : (
              <Tooltip title="Save">
                <IconButton
                  disabled={colors === shopInfo.settings}
                  color="info"
                  onClick={saveSettings}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
            )}
          </p>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 300px)"}
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
                  this is what your navbar will look like
                  <IconButton
                    onClick={() => {
                      setTitle("change header color");
                      setCurrentColor("headerColor");
                      setAction(AdminActions.UPDATE);
                    }}
                  >
                    <PaletteIcon color="warning" />
                  </IconButton>
                </div>
                <br />
                <div
                  className={themeStyles.popupPreview}
                  style={{
                    backgroundColor: colors.headerColor,
                    border: `1px solid ${deduceColor(colors.headerColor)}`,
                    color: deduceColor(colors.headerColor),
                  }}
                >
                  this is what popups will look like
                </div>
                <br />
                <div className={themeStyles.bodyPreview}>
                  <p>- tables color will look like this:</p>
                  <br />
                  <table>
                    <thead
                      style={{
                        backgroundColor: colors.headerColor,
                        color: deduceColor(colors.headerColor),
                      }}
                    >
                      <tr>
                        <th>attribute 1</th>
                        <th>attribute 2</th>
                        <th>attribute 3</th>
                        <th>attribute 4</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>value 1</td>
                        <td>value 2</td>
                        <td>value 3</td>
                        <td>value 4</td>
                      </tr>
                      <tr>
                        <td>value 1</td>
                        <td>value 2</td>
                        <td>value 3</td>
                        <td>value 4</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <p>- main color will look like this:</p>
                  <br />
                  <div className="row" style={{ justifyContent: "flex-start" }}>
                    <div
                      className={themeStyles.primaryColor}
                      style={{
                        backgroundColor: colors.primaryColor,
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        setTitle("change primary color");
                        setCurrentColor("primaryColor");
                        setAction(AdminActions.UPDATE);
                      }}
                    >
                      <PaletteIcon color="warning" />
                    </IconButton>
                  </div>
                  <br />
                  <p>- secondary color will look like this:</p>
                  <br />
                  <div className="row" style={{ justifyContent: "flex-start" }}>
                    <div
                      className={themeStyles.secondaryColor}
                      style={{
                        backgroundColor: colors.secondaryColor,
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        setTitle("change secondary color");
                        setCurrentColor("secondaryColor");
                        setAction(AdminActions.UPDATE);
                      }}
                    >
                      <PaletteIcon color="warning" />
                    </IconButton>
                  </div>
                  <br />
                  <p>- controls will look like this:</p>
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
                  <p>- accents will look like this:</p>
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
                  <IconButton
                    onClick={() => {
                      setTitle("change footer color");
                      setCurrentColor("footerColor");
                      setAction(AdminActions.UPDATE);
                    }}
                  >
                    <PaletteIcon color="warning" />
                  </IconButton>
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
