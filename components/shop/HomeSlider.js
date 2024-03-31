import { Link } from "@mui/material";
import React from "react";
import { SwiperSlide } from "swiper/react";
import XSwiper from "../ui-components/XSwiper";

function HomeSlider({ slides, shopName, ...props }) {
  return (
    <>
      {slides.length ? (
        <XSwiper
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={slides.length > 1}
          style={{ width: "100%", height: "80vh" }}
        >
          {slides.map((slide, index) => {
            return (
              <SwiperSlide key={index}>
                {slide.link && slide.link !== "" ? (
                  <a href={slide.link} rel="noreferrer" target="_blank">
                    <img
                      src={
                        slide.image !== "image-placeholder.jpg"
                          ? `/api/images/${slide.image.split("/").pop()}`
                          : "/images/image-placeholder.jpg"
                      }
                      onError={(e) => {
                        e.target.src = "/images/image-placeholder.jpg";
                      }}
                      alt={slide.link}
                    />
                  </a>
                ) : slide.category && slide.category !== "" ? (
                  <Link
                    href={`/shop/products?shop=${shopName}&category=${slide.category}`}
                  >
                    <img
                      src={
                        slide.image !== "image-placeholder.jpg"
                          ? `/api/images/${slide.image.split("/").pop()}`
                          : "/images/image-placeholder.jpg"
                      }
                      onError={(e) => {
                        e.target.src = "/images/image-placeholder.jpg";
                      }}
                      alt={slide.category}
                    />
                  </Link>
                ) : (
                  <img
                    src={
                      slide.image !== "image-placeholder.jpg"
                        ? `/api/images/${slide.image.split("/").pop()}`
                        : "/images/image-placeholder.jpg"
                    }
                    onError={(e) => {
                      e.target.src = "/images/image-placeholder.jpg";
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
