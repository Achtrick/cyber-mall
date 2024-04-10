import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { SwiperSlide } from "swiper/react";
import styles from "../../styles/shop/ProductsSlider.module.scss";
import {
  calculateDiscount,
  deduceColor,
} from "../../utils/config/convertHelper";
import XButton from "../ui-components/XButton";
import XSwiper from "../ui-components/XSwiper";

function ProductsSlider({
  activateControls = true,
  products,
  shopInfo,
  title,
  buttonAction,
}) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isMobile = useMediaQuery("(max-width:800px)");

  const checkVariants = (product) => {
    if (!product.variants?.length) {
      setSelectedVariant(null);
      setSelectedProduct(null);
      buttonAction(shopInfo.name, product);
    } else {
      setSelectedProduct(product);
      isMobile &&
        setTimeout(() => {
          setSelectedVariant(null);
          setSelectedProduct(null);
        }, 5000);
    }
  };

  const tagStyle = {
    color: shopInfo?.settings.primaryColor,
    border: `1px solid ${shopInfo?.settings.primaryColor}`,
  };

  const activeTagStyle = {
    color: shopInfo && deduceColor(shopInfo?.settings.primaryColor),
    backgroundColor: shopInfo?.settings.primaryColor,
  };

  const tagMouseOver = (e) => {
    e.target.style.backgroundColor = shopInfo?.settings.primaryColor;
    e.target.style.color = deduceColor(shopInfo?.settings.primaryColor);
  };

  const tagMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = shopInfo?.settings.primaryColor;
  };

  return (
    <section className={styles.container}>
      <h2>{title}</h2>
      <br />
      <XSwiper
        autoplay={false}
        loop={true}
        slidesPerView={isMobile ? 2 : 4}
        spaceBetween={20}
      >
        {products.map((product, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className={styles.product}
                style={{ alignItems: "flex-start" }}
              >
                <Link
                  href={
                    activateControls
                      ? `/shop/product/?shop=${shopInfo.name}&id=${product._id}`
                      : ""
                  }
                >
                  <img
                    alt={index}
                    src={
                      product.images[0]
                        ? `/api/images/${product.images[0].split("/").pop()}`
                        : "/images/image-placeholder.jpg"
                    }
                    onError={(e) => {
                      e.target.src = "/images/image-placeholder.jpg";
                    }}
                  />
                </Link>
                <p>{product.designation}</p>
                {product.discount && product.discount !== 0 ? (
                  <p className={styles.oldPrice}>
                    {product.price.toLocaleString() + " DT"}
                  </p>
                ) : null}
                <p className={styles.price}>
                  {calculateDiscount(
                    product.price,
                    product.discount
                  ).toLocaleString() + " DT"}
                </p>
                <div
                  onMouseLeave={() => {
                    setSelectedVariant(null);
                    setSelectedProduct(null);
                  }}
                  className="variantPickerContainer"
                >
                  <div
                    className={
                      product._id === selectedProduct?._id
                        ? `variantPicker variantPickerActive`
                        : `variantPicker`
                    }
                  >
                    {product.variants?.map((variant, key) => {
                      return (
                        <span
                          style={
                            selectedVariant === variant
                              ? activeTagStyle
                              : tagStyle
                          }
                          onMouseOver={
                            selectedVariant === variant ? null : tagMouseOver
                          }
                          onMouseLeave={
                            selectedVariant === variant ? null : tagMouseLeave
                          }
                          className="tag"
                          key={key}
                          onClick={() => {
                            setSelectedVariant(variant);
                            setTimeout(() => {
                              buttonAction(shopInfo.name, {
                                ...product,
                                designation:
                                  product.designation + " | " + variant,
                              });
                              setSelectedProduct(null);
                              setSelectedVariant(null);
                            }, 100);
                          }}
                        >
                          {variant}
                        </span>
                      );
                    })}
                  </div>

                  <XButton
                    color={shopInfo.settings.primaryColor}
                    text={"Acheter"}
                    action={
                      buttonAction ? () => checkVariants(product) : () => {}
                    }
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </XSwiper>
    </section>
  );
}

export default ProductsSlider;
