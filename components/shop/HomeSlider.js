import { Link, useMediaQuery } from "@mui/material";
import React from "react";
import { SwiperSlide } from "swiper/react";
import XSwiper from "../ui-components/XSwiper";

function HomeSlider({ slides, shopName, ...props }) {
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <>
      {slides.length ? (
        <XSwiper
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={slides.length > 1}
          style={{ width: "100%", height: "100%" }}
        >
          {slides.map((slide, index) => {
            return (
              <SwiperSlide key={index}>
                {slide.link && slide.link !== "" ? (
                  <a href={slide.link} rel="noreferrer" target="_blank">
                    <img
                      src={
                        slide.image !== "slider-placeholder.jpg"
                          ? `/api/images/${slide.image.split("/").pop()}${
                              isMobile
                                ? "?width=450&height=450"
                                : "?width=900&height=900"
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
                    href={`/${shopName}/products?category=${slide.category}`}
                  >
                    <img
                      src={
                        slide.image !== "slider-placeholder.jpg"
                          ? `/api/images/${slide.image.split("/").pop()}${
                              isMobile
                                ? "?width=450&height=450"
                                : "?width=900&height=900"
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
                    src={
                      slide.image !== "slider-placeholder.jpg"
                        ? `/api/images/${slide.image.split("/").pop()}${
                            isMobile
                              ? "?width=450&height=450"
                              : "?width=900&height=900"
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
