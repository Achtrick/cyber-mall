import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import React from "react";
import { SwiperSlide } from "swiper/react";
import styles from "../../styles/shop/CategoriesGrid.module.scss";
import XSwiper from "../ui-components/XSwiper";

function CategoriesGrid({ disabled, categories, architecture, shopInfo }) {
  const isMobile = useMediaQuery("(max-width:800px)");
  const handleClick = (event) => {
    disabled && event.preventDefault();
  };
  return (
    <section className={styles.container}>
      <h2>discover our categories</h2>
      <br />
      {categories?.filter((category) =>
        architecture.home.categoriesComponent.selectedCategoriesIds.includes(
          category._id
        )
      ).length ? (
        <XSwiper
          slidesPerView={isMobile ? 3 : 5}
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
                    onClick={handleClick}
                    href={
                      shopInfo?.domainName.length
                        ? `/products?category=${category.name}`
                        : `/${shopInfo.name}/products?category=${category.name}`
                    }
                  >
                    <div className={styles.category}>
                      <img
                        alt={index}
                        src={`/api/images/${category.icon
                          .split("/")
                          .pop()}?width=400&height=400`}
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
