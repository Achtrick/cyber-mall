import Link from "next/link";
import React from "react";
import { SwiperSlide } from "swiper/react";
import styles from "../../styles/shop/ProductsSlider.module.scss";
import { calculateDiscount } from "../../utils/config/convertHelper";
import XButton from "../ui-components/XButton";
import XSwiper from "../ui-components/XSwiper";

function ProductsSlider({
  activateControls = true,
  products,
  shopName,
  settings,
  title,
}) {
  return (
    <section className={styles.container}>
      <h2>{title}</h2>
      <br />
      <XSwiper autoplay={true} loop={true} slidesPerView={4} spaceBetween={20}>
        {products.map((product, index) => {
          return (
            <SwiperSlide key={index}>
              <div className={styles.product}>
                <Link
                  href={
                    activateControls
                      ? `/shop/product/?shop=${shopName}&id=${product._id}`
                      : ""
                  }
                >
                  <img alt={index} src={product.images[0]} />
                </Link>
                <p>{product.designation}</p>
                {product.discount && product.discount !== 0 ? (
                  <p className={styles.oldPrice}>{product.price + " DT"}</p>
                ) : null}
                <p className={styles.price}>
                  {calculateDiscount(product.price, product.discount) + " DT"}
                </p>
                <XButton
                  color={settings.primaryColor}
                  text={"add to cart"}
                  action={() => {}}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </XSwiper>
    </section>
  );
}

export default ProductsSlider;
