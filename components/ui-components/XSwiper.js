import { useMediaQuery } from "@mui/material";
import React from "react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { Swiper } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function XSwiper({
  slidesPerView,
  spaceBetween,
  style,
  autoplay,
  loop,
  pagination = false,
  ...props
}) {
  const isMobile = useMediaQuery("(max-width:768px");
  SwiperCore.use([Autoplay]);

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      loop={loop}
      autoplay={autoplay}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      style={style}
      navigation={true}
      pagination={pagination}
    >
      {props.children}
    </Swiper>
  );
}

export default XSwiper;
