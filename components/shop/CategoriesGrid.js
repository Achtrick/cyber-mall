import React from "react";
import styles from "../../styles/shop/CategoriesGrid.module.scss";
import Link from "next/link";

function CategoriesGrid({
  activateControls = true,
  categories,
  architecture,
  shopName,
  props,
}) {
  return (
    <section className={styles.container}>
      <h2>discover our categories</h2>
      <br />
      <div className={styles.grid}>
        {categories
          ?.filter((category) =>
            architecture.home.categoriesComponent.selectedCategoriesIds.includes(
              category._id
            )
          )
          .map((category, index) => {
            return (
              <div key={index} className={styles.category}>
                <Link
                  href={
                    activateControls
                      ? `shop/products/?shop=${shopName}&category=${category.name}`
                      : ""
                  }
                >
                  <img alt={index} src={category.icon} />
                  <p>{category.name}</p>
                </Link>
              </div>
            );
          })}
      </div>
    </section>
  );
}

export default CategoriesGrid;
