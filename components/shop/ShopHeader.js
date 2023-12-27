import { CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../../styles/shop/ShopHeader.module.scss";
import { deduceColor, isColorDark } from "../../utils/config/convertHelper";
import {
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  ShoppingCartIcon,
} from "../../utils/theme/icons";

function ShopHeader({ shopInfo, ...props }) {
  const [categoriesVisible, setCategoriesVisible] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const getCategories = async () => {
    setLoadingCategories(true);
    const { data } = await axios.post("/api/admin/categories/get", {
      shop: shopInfo._id,
    });
    setCategories(data);
    setLoadingCategories(false);
  };

  const toggleCategoriesVisibility = () => {
    setCategoriesVisible(!categoriesVisible);
  };

  const loadCategories = async () => {
    if (!categories.length) {
      await getCategories();
      setCategoriesVisible(true);
    }
  };

  return (
    <div
      className={styles.header}
      style={{
        backgroundColor: shopInfo.settings.headerColor,
        color: deduceColor(shopInfo.settings.headerColor),
        borderBottom: `1px solid ${deduceColor(shopInfo.settings.headerColor)}`,
      }}
    >
      <div className={styles.logo}>
        {shopInfo.logo ? (
          <Link href={`/shop?shopName=${shopInfo.name}`}>
            <Image
              alt="logo"
              src={shopInfo.logo}
              width={"60"}
              height={"60"}
              style={{
                objectFit: "contain",
              }}
            />
          </Link>
        ) : (
          <Link href={`/shop?shopName=${shopInfo.name}`}>
            <div className="row">
              <Image
                alt="logo"
                src={"/images/default-store.png"}
                width={"40"}
                height={"40"}
                style={{
                  objectFit: "contain",
                  backgroundColor: "white",
                  padding: "5px",
                  borderRadius: "5px",
                }}
              />
              &nbsp;
              <p
                style={{
                  color: deduceColor(shopInfo.settings.headerColor),
                }}
              >
                {shopInfo.name}
              </p>
            </div>
          </Link>
        )}
      </div>
      <div className={styles.links}>
        <Link href={`shop/?shopName=${shopInfo.name}`}>home</Link>
        <span className={styles.categoriesTitle}>
          <p
            onClick={
              categories.length ? toggleCategoriesVisibility : loadCategories
            }
          >
            categories&nbsp;
            {loadingCategories ? (
              <CircularProgress sx={{ marginLeft: "7px" }} size={"17px"} />
            ) : categoriesVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </p>
          <span
            style={{
              backgroundColor: shopInfo.settings.headerColor,
              border: `1px solid ${deduceColor(shopInfo.settings.headerColor)}`,
            }}
            className={
              categoriesVisible
                ? `${styles.categoriesDropDown} + ${styles.categoriesDropDownVisible}`
                : styles.categoriesDropDown
            }
          >
            {categories.map((category) => {
              return (
                <span className={styles.category} key={category._id}>
                  {category.name}
                </span>
              );
            })}
          </span>
        </span>
        <Link href={`shop/contact/?shopName=${shopInfo.name}`}>contact</Link>
      </div>
      <div className={styles.controls}>
        <div className="badge-container">
          <span
            className="badge"
            style={{
              backgroundColor: deduceColor(shopInfo.settings.primaryColor),
              color:
                deduceColor(shopInfo.settings.primaryColor) === "white"
                  ? "black"
                  : "white",
            }}
          >
            5
          </span>
          <Link href={`shop/cart/?shopName=${shopInfo.name}`}>
            <IconButton color={deduceColor(shopInfo.settings.primaryColor)}>
              <ShoppingCartIcon />
            </IconButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShopHeader;
