import Link from "next/link";
import React from "react";
import { SwiperSlide } from "swiper/react";
import styles from "../../styles/shop/DiscountsSection.module.scss";
import { calculateDiscount } from "../../utils/config/convertHelper";
import XButton from "../ui-components/XButton";
import XSwiper from "../ui-components/XSwiper";

function DiscountsSection({
  activateControls = true,
  discounts,
  shopName,
  settings,
}) {
  return (
    <section className={styles.container}>
      <h2>Get More For Less !</h2>
      <br />
      <XSwiper autoplay={true} loop={true} slidesPerView={4} spaceBetween={20}>
        {discounts.map((product, index) => {
          return (
            <SwiperSlide key={index}>
              <div className={styles.product}>
                <Link
                  href={
                    activateControls
                      ? `product/?shop=${shopName}&?id=${product._id}`
                      : ""
                  }
                >
                  <img alt={index} src={product.images[0]} />
                </Link>
                <p>{product.designation}</p>
                <p className={styles.oldPrice}>{product.price + " DT"}</p>
                <p className={styles.price}>
                  {calculateDiscount(product.price, product.discount) + " DT"}
                </p>
                <XButton
                  color={settings.primaryColor}
                  text={"add to cart"}
                  action={() => {
                    console.log("add to cart");
                  }}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </XSwiper>
    </section>
  );
}

export default DiscountsSection;
