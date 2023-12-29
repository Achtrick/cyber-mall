import { Link } from "@mui/material";
import React from "react";
import XSwiper from "../ui-components/XSwiper";
import { SwiperSlide } from "swiper/react";

function HomeSlider({ slides, ...props }) {
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
                  <Link href={slide.link}>
                    <img src={slide.image} alt={slide.link} />
                  </Link>
                ) : slide.category && slide.category !== "" ? (
                  <Link href={slide.category}>
                    <img src={slide.image} alt={slide.category} />
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
