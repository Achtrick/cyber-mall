import React, { useEffect, useState } from "react";
import { isColorDark } from "../../utils/config/convertHelper";
import styles from "../../styles/shop/ShopHeader.module.scss";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
} from "../../utils/theme/icons";

function ShopHeader({ shopInfo, ...props }) {
  const [textColor, setTextColor] = useState("white");

  const [categoriesVisible, setCategoriesVisible] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    setTextColor(textColor);
    if (!categories.length) {
      getCategories();
    }
  }, []);

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

  return (
    <div
      className={styles.header}
      style={{
        backgroundColor: shopInfo.settings.headerColor,
        color: textColor,
      }}
    >
      <div className={styles.logo}>
        {shopInfo.logo ? (
          <Link href="/admin/dashboard">
            <div className={styles.header}>
              <Image
                alt="logo"
                src={shopInfo.logo}
                width={"30"}
                height={"30"}
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </Link>
        ) : (
          <Link href="/admin/dashboard">
            <div className={styles.header}>
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
          <p onClick={toggleCategoriesVisibility}>
            categories{" "}
            {categoriesVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </p>
          <span
            style={{
              backgroundColor: shopInfo.settings.headerColor,
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
      <div className={styles.controls}>cart/login/register</div>
    </div>
  );
}

export default ShopHeader;
