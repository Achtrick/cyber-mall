import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import React from "react";
import { SwiperSlide } from "swiper/react";
import styles from "../../styles/shop/CategoriesGrid.module.scss";
import XSwiper from "../ui-components/XSwiper";

function CategoriesGrid({
  activateControls = true,
  categories,
  architecture,
  shopName,
  props,
}) {
  const isMobile = useMediaQuery("(max-width:800px)");
  return (
    <section className={styles.container}>
      <h2>découvrir nos catégories</h2>
      <br />
      {categories?.filter((category) =>
        architecture.home.categoriesComponent.selectedCategoriesIds.includes(
          category._id
        )
      ).length ? (
        <XSwiper
          slidesPerView={isMobile ? 1 : 3}
          spaceBetween={20}
          loop={true}
          autoplay={false}
          style={{ width: "100%", height: "250px" }}
        >
          {categories
            ?.filter((category) =>
              architecture.home.categoriesComponent.selectedCategoriesIds.includes(
                category._id
              )
            )
            .map((category, index) => {
              return (
                <SwiperSlide key={index}>
                  <Link
                    href={
                      activateControls
                        ? `/shop/products/?shop=${shopName}&category=${category.name}`
                        : ""
                    }
                  >
                    <div className={styles.category}>
                      <img
                        alt={index}
                        src={`/api/images/${category.icon.split("/").pop()}`}
                        onError={(e) => {
                          e.target.src = "/images/category.svg";
                        }}
                      />
                      <p>{category.name}</p>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
        </XSwiper>
      ) : null}
    </section>
  );
}

export default CategoriesGrid;
