import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import styles from "../../styles/admin/Dashboard.module.scss";
import themeStyles from "../../styles/admin/Theme.module.scss";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button, CircularProgress, IconButton, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import { isColorDark } from "../../utils/config/convertHelper";
import { CheckCircleIcon, PaletteIcon } from "../../utils/theme/icons";
import XModal from "../../components/ui-components/XModal";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import { getError } from "../../utils/shared/getError";
import { useSnackbar } from "notistack";

function Theme(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState({});

  const [deducedHeaderColor, setDeducedHeaderColor] = useState("white");
  const [deducedHeaderColorInverse, setDeducedHeaderColorInverse] =
    useState("black");
  const [deducedFooterColor, setDeducedFooterColor] = useState("white");
  const [deducedFooterColorInverse, setDeducedFooterColorInverse] =
    useState("black");
  const [deducedPimaryColor, setDeducedPrimaryColor] = useState("white");

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
      setDeducedHeaderColor(
        isColorDark(data.settings.headerColor) ? "white" : "black"
      );
      setDeducedHeaderColorInverse(
        isColorDark(data.settings.headerColor) ? "black" : "white"
      );
      setDeducedFooterColor(
        isColorDark(data.settings.footerColor) ? "white" : "black"
      );
      setDeducedFooterColorInverse(
        isColorDark(data.settings.footerColor) ? "black" : "white"
      );
      setDeducedPrimaryColor(
        isColorDark(data.settings.primaryColor) ? "white" : "black"
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
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
      getShopInfo();
    } catch (error) {
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
            <IconButton
              disabled={colors === shopInfo.settings}
              color="info"
              onClick={saveSettings}
            >
              <CheckCircleIcon />
            </IconButton>
          </p>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 150px)"}
            />
          ) : (
            <section>
              <div className={themeStyles.pagePreview}>
                <div
                  className={themeStyles.headerPreview}
                  style={{
                    backgroundColor: colors.headerColor,
                    border: `1px solid ${deducedHeaderColor}`,
                    color: deducedHeaderColor,
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
                    border: `1px solid ${deducedHeaderColor}`,
                    color: deducedHeaderColor,
                  }}
                >
                  this is what popups will look like
                </div>
                <br />
                <div className={themeStyles.bodyPreview}>
                  <p>- accents will look like this:</p>
                  <br />
                  <button
                    style={{
                      backgroundColor: colors.primaryColor,
                      color: deducedPimaryColor,
                    }}
                  >
                    actions
                  </button>
                  <br />
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
                  <p>- tables color will look like this:</p>
                  <br />
                  <table>
                    <thead
                      style={{
                        backgroundColor: colors.headerColor,
                        color: deducedHeaderColor,
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
                </div>
                <br />
                <br />
                <div
                  className={themeStyles.footerPreview}
                  style={{
                    backgroundColor: colors.footerColor,
                    color: deducedFooterColor,
                    border: `1px solid ${deducedFooterColor}`,
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
