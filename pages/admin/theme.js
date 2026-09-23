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

const COLOR_FIELDS = [
  { key: "headerColor", label: "Header" },
  { key: "primaryColor", label: "Primary" },
  { key: "secondaryColor", label: "Secondary" },
  { key: "footerColor", label: "Footer" },
];

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
  const [copiedFrom, setCopiedFrom] = useState(null);

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
      setCopiedFrom(null);
      enqueueSnackbar("Color applied", {
        variant: "info",
      });
    } else {
      setCopiedColor(colors[color]);
      setCopiedFrom(color);
      enqueueSnackbar("Color copied", {
        variant: "info",
      });
    }
  };

  const cancelColorCopy = () => {
    setCopiedColor(null);
    setCopiedFrom(null);
  };

  const openColorEditor = (field) => {
    setTitle(`Change the ${field.label.toLowerCase()} color`);
    setCurrentColor(field.key);
    setAction(AdminActions.UPDATE);
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
          <div className={styles.controls}>
            <h1>Theme</h1>
          </div>

          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 250px)"}
            />
          ) : (
            <section>
              {copiedColor && (
                <div className={themeStyles.copyBanner}>
                  <span>
                    Color copied — click &quot;Paste here&quot; on another
                    swatch to apply it.
                  </span>
                  <button className="btn btn-sm" onClick={cancelColorCopy}>
                    Cancel
                  </button>
                </div>
              )}

              <div className={themeStyles.colorsGrid}>
                {COLOR_FIELDS.map((field) => (
                  <div className={themeStyles.colorCard} key={field.key}>
                    <div
                      className={themeStyles.swatch}
                      style={{ backgroundColor: colors[field.key] }}
                    />
                    <div className={themeStyles.colorInfo}>
                      <p className={themeStyles.colorLabel}>{field.label}</p>
                      <p className={themeStyles.colorHex}>{colors[field.key]}</p>
                    </div>
                    <div className={`btn-group ${themeStyles.colorActions}`}>
                      <button
                        className="btn btn-sm"
                        onClick={() => openColorEditor(field)}
                      >
                        Change
                      </button>
                      {copiedFrom === field.key ? (
                        <button className="btn btn-sm" disabled>
                          Copied
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm"
                          onClick={() => handleColorCopyPaste(field.key)}
                        >
                          {copiedColor ? "Paste here" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className={themeStyles.previewLabel}>Live preview</p>
              <div className={themeStyles.pagePreview}>
                <div
                  className={themeStyles.headerPreview}
                  style={{
                    backgroundColor: colors.headerColor,
                    border: `1px solid ${deduceColor(colors.headerColor)}`,
                    color: deduceColor(colors.headerColor),
                  }}
                >
                  Your navigation bar
                </div>
                <div className={themeStyles.bodyPreview}>
                  <div className={themeStyles.previewRow}>
                    <span>Primary color</span>
                    <div
                      className={themeStyles.primaryColor}
                      style={{ backgroundColor: colors.primaryColor }}
                    />
                  </div>
                  <div className={themeStyles.previewRow}>
                    <span>Controls</span>
                    <div className={themeStyles.controlsPreview}>
                      <XButton text="action" color={colors.primaryColor} />
                      <XBadge color={colors.primaryColor} content={5}>
                        <IconButton
                          color={deduceColor(shopInfo.settings.headerColor)}
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                      </XBadge>
                      <CircularProgress
                        size={"22px"}
                        style={{ color: colors.primaryColor }}
                      />
                    </div>
                  </div>
                  <div className={themeStyles.previewRow}>
                    <span>Secondary color</span>
                    <div
                      className={themeStyles.secondaryColor}
                      style={{ backgroundColor: colors.secondaryColor }}
                    />
                  </div>
                  <div className={themeStyles.previewRow}>
                    <span>Accents</span>
                    <XHr color={colors.secondaryColor} />
                  </div>
                </div>
                <div
                  className={themeStyles.footerPreview}
                  style={{
                    backgroundColor: colors.footerColor,
                    color: deduceColor(colors.footerColor),
                    border: `1px solid ${deduceColor(colors.footerColor)}`,
                  }}
                >
                  Your footer
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
