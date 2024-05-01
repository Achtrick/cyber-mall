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
import { PaletteIcon, ShoppingCartIcon } from "../../utils/theme/icons";

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
      setAction("");
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
                  width: "50%",
                  height: "50px",
                }}
              />
            </form>
          </div>
        </XModal>
        <section className={styles.container}>
          <div className={styles.controls} style={{ justifyContent: "center" }}>
            <h1>Thème</h1>
          </div>
          <p>
            cliquer sur{" "}
            <IconButton disabled>
              <PaletteIcon color="warning" />
            </IconButton>{" "}
            pour changer d&apos;apparence
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
                  voici à quoi ressemblera votre barre de navigation
                  <Tooltip title="Modifier">
                    <IconButton
                      onClick={() => {
                        setTitle("changer la couleur de l'en-tête");
                        setCurrentColor("headerColor");
                        setAction(AdminActions.UPDATE);
                      }}
                    >
                      <PaletteIcon color="warning" />
                    </IconButton>
                  </Tooltip>
                </div>
                <br />
                <div className={themeStyles.bodyPreview}>
                  <p>la couleur principale ressemblera à ceci :</p>
                  <br />
                  <div className="row" style={{ justifyContent: "flex-start" }}>
                    <div
                      className={themeStyles.primaryColor}
                      style={{
                        backgroundColor: colors.primaryColor,
                      }}
                    />
                    <Tooltip title="Modifier">
                      <IconButton
                        onClick={() => {
                          setTitle("changer la couleur primaire");
                          setCurrentColor("primaryColor");
                          setAction(AdminActions.UPDATE);
                        }}
                      >
                        <PaletteIcon color="warning" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <br />
                  <p>les contrôles ressembleront à ceci :</p>
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
                  <p>la couleur secondaire ressemblera à ceci :</p>
                  <br />
                  <div className="row" style={{ justifyContent: "flex-start" }}>
                    <div
                      className={themeStyles.secondaryColor}
                      style={{
                        backgroundColor: colors.secondaryColor,
                      }}
                    />
                    <Tooltip title="Modifier">
                      <IconButton
                        onClick={() => {
                          setTitle("changer la couleur secondaire");
                          setCurrentColor("secondaryColor");
                          setAction(AdminActions.UPDATE);
                        }}
                      >
                        <PaletteIcon color="warning" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <br />
                  <p>les accents ressembleront à ceci</p>
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
                  voici à quoi ressemblera votre pied de page
                  <Tooltip title="Modifier">
                    <IconButton
                      onClick={() => {
                        setTitle("changer la couleur du pied de page");
                        setCurrentColor("footerColor");
                        setAction(AdminActions.UPDATE);
                      }}
                    >
                      <PaletteIcon color="warning" />
                    </IconButton>
                  </Tooltip>
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
