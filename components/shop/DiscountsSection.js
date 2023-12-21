import React from "react";
import styles from "../../styles/shop/DiscountsSection.module.scss";
import Link from "next/link";
import { calculateDiscount } from "../../utils/config/convertHelper";

function DiscountsSection({
  activateControls = true,
  discounts,
  shopName,
  props,
}) {
  return (
    <section className={styles.container}>
      <h2>Get More For Less !</h2>
      <br />
      <div className={styles.grid}>
        {discounts.map((product, index) => {
          return (
            <div key={index} className={styles.product}>
              <Link
                href={
                  activateControls
                    ? `product/?shopName=${shopName}&?id=${product._id}`
                    : ""
                }
              >
                <img alt={index} src={product.images[0]} />
                <p>{product.designation}</p>
                <p className={styles.oldPrice}>{product.price + " DT"}</p>
                <p className={styles.price}>
                  {calculateDiscount(product.price, product.discount) + " DT"}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DiscountsSection;
