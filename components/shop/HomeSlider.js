import { Link } from "@mui/material";
import React from "react";
import XSwiper from "../ui-components/XSwiper";
import { SwiperSlide } from "swiper/react";

function HomeSlider({ slides, ...props }) {
  return (
    <>
      {slides ? (
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
                {slide.link ? (
                  <Link href={slide.link}>
                    <img
                      style={{
                        width: "100% !important;",
                        height: "100% !important;",
                        objectFit: "cover !important;",
                      }}
                      src={slide.image}
                      alt={slide.link}
                    />
                  </Link>
                ) : (
                  <img src={slide.image} alt="slide" />
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
