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
import { PaletteIcon } from "../../utils/theme/icons";
import XModal from "../../components/ui-components/XModal";

function Theme(props) {
  const { userInfo } = useSelector((state) => state.auth);

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

  useEffect(() => {
    getShopInfo();
  }, []);

  const getShopInfo = async () => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: userInfo.shop.name,
      });

      setShopInfo(data);
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

  return (
    <AdminLayout>
      <XModal open={action !== ""} onClose={() => setAction("")}></XModal>
      <DisconnectedGuard>
        <section className={styles.container}>
          <div className={styles.controls} style={{ justifyContent: "center" }}>
            <h1>Theme</h1>
          </div>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 200px)"}
            />
          ) : (
            <section>
              <div className={themeStyles.pagePreview}>
                <div
                  className={themeStyles.headerPreview}
                  style={{
                    backgroundColor: shopInfo.settings.headerColor,
                    border: `1px solid ${deducedHeaderColor}`,
                    color: deducedFooterColor,
                  }}
                >
                  this is what your navbar will look like
                  <IconButton>
                    <PaletteIcon />
                  </IconButton>
                </div>
                <br />
                <div
                  className={themeStyles.popupPreview}
                  style={{
                    backgroundColor: shopInfo.settings.headerColor,
                    border: `1px solid ${deducedHeaderColor}`,
                    color: deducedFooterColor,
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
                      backgroundColor: shopInfo.settings.primaryColor,
                      color: deducedPimaryColor,
                    }}
                  >
                    actions
                  </button>
                  <br />
                  <br />
                  <p>- main color will look like this:</p>
                  <br />
                  <div
                    className={themeStyles.primaryColor}
                    style={{
                      backgroundColor: shopInfo.settings.primaryColor,
                    }}
                  />
                  <br />
                  <p>- secondary color will look like this:</p>
                  <br />
                  <div
                    className={themeStyles.secondaryColor}
                    style={{
                      backgroundColor: shopInfo.settings.secondaryColor,
                    }}
                  />
                  <br />
                  <p>- tables color will look like this:</p>
                  <br />
                  <table>
                    <thead
                      style={{
                        backgroundColor: shopInfo.settings.headerColor,
                        color: deducedHeaderColor,
                      }}
                    >
                      <th>attribute 1</th>
                      <th>attribute 2</th>
                      <th>attribute 3</th>
                      <th>attribute 4</th>
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
                    backgroundColor: shopInfo.settings.headerColor,
                    border: `1px solid ${deducedHeaderColor}`,
                  }}
                >
                  this is what your footer will look like
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
