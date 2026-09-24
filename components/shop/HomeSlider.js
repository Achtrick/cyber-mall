import { Link, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { SwiperSlide } from "swiper/react";
import styles from "../../styles/shop/HomeSlider.module.scss";
import { shopPath } from "../../utils/shared/shopUrl";
import XSwiper from "../ui-components/XSwiper";

function HomeSlider({ slides, disabled, shopInfo, ...props }) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:800px)");
  const handleClick = (event) => {
    disabled && event.preventDefault();
  };
  return (
    <>
      {slides.length ? (
        <XSwiper
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={slides.length > 1}
          style={{ width: "100%", height: "60dvh" }}
        >
          {slides.map((slide, index) => {
            return (
              <SwiperSlide key={index}>
                {slide.link && slide.link !== "" ? (
                  <a
                    onClick={handleClick}
                    href={slide.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img
                      className={styles.slideImg}
                      src={
                        slide.image !== "slider-placeholder.jpg"
                          ? `/api/images/${slide.image.split("/").pop()}${
                              isMobile
                                ? "?width=950&height=540"
                                : "?width=1920&height=1080"
                            }`
                          : "/images/slider-placeholder.jpg"
                      }
                      onError={(e) => {
                        e.target.src = "/images/slider-placeholder.jpg";
                      }}
                      alt={slide.link}
                    />
                  </a>
                ) : slide.category && slide.category !== "" ? (
                  <Link
                    onClick={handleClick}
                    href={shopPath(
                      shopInfo,
                      router.asPath,
                      `/products?category=${slide.category}`
                    )}
                  >
                    <img
                      className={styles.slideImg}
                      src={
                        slide.image !== "slider-placeholder.jpg"
                          ? `/api/images/${slide.image.split("/").pop()}${
                              isMobile
                                ? "?width=950&height=540"
                                : "?width=1920&height=1080"
                            }`
                          : "/images/slider-placeholder.jpg"
                      }
                      onError={(e) => {
                        e.target.src = "/images/slider-placeholder.jpg";
                      }}
                      alt={slide.category}
                    />
                  </Link>
                ) : (
                  <img
                    className={styles.slideImg}
                    src={
                      slide.image !== "slider-placeholder.jpg"
                        ? `/api/images/${slide.image.split("/").pop()}${
                            isMobile
                              ? "?width=950&height=540"
                              : "?width=1920&height=1080"
                          }`
                        : "/images/slider-placeholder.jpg"
                    }
                    onError={(e) => {
                      e.target.src = "/images/slider-placeholder.jpg";
                    }}
                    alt="slide"
                  />
                )}
              </SwiperSlide>
            );
          })}
        </XSwiper>
      ) : null}
    </>
  );
}

export default HomeSlider;
