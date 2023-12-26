import { CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../../styles/shop/ShopHeader.module.scss";
import { isColorDark } from "../../utils/config/convertHelper";
import {
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  ShoppingCartIcon,
} from "../../utils/theme/icons";

function ShopHeader({ shopInfo, deducedColor, deducedColorInverse, ...props }) {
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
        color: deducedColor,
        borderBottom: `1px solid ${deducedColor}`,
      }}
    >
      <div className={styles.logo}>
        {shopInfo.logo ? (
          <Link href="/">
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
          <Link href="/">
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
                  color: isColorDark(shopInfo.settings.headerColor)
                    ? "white"
                    : "black",
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
              border: `1px solid ${deducedColor}`,
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
              backgroundColor: deducedColor,
              color: deducedColorInverse,
            }}
          >
            5
          </span>
          <Link href={`shop/cart/?shopName=${shopInfo.name}`}>
            <IconButton color={deducedColor}>
              <ShoppingCartIcon />
            </IconButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShopHeader;
