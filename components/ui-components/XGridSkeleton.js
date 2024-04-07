import { useMediaQuery } from "@mui/material";
import { SwiperSlide } from "swiper/react";
import styles from "../../styles/shop/CategoriesGrid.module.scss";
import XSwiper from "../ui-components/XSwiper";
function XGridSkeleton({ title }) {
  const isMobile = useMediaQuery("(max-width:800px)");
  return (
    <>
      <section
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        <h2 align="center">{title}</h2>

        <XSwiper
          slidesPerView={isMobile ? 1 : 3}
          spaceBetween={20}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "250px" }}
        >
          {[1, 2, 3, 4, 5, 6].map((_, index) => {
            return (
              <SwiperSlide key={index}>
                <div className={styles.category}>
                  {title.includes("Catégories") ? (
                    <>
                      <img src="/images/category.svg" />
                      <p>Catégorie</p>
                    </>
                  ) : (
                    <>
                      <img src="/images/image-placeholder.jpg" />
                      <h4 style={{ margin: "5px 0px" }}>Designation</h4>
                      <p>prix</p>
                    </>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </XSwiper>
      </section>
    </>
  );
}

export default XGridSkeleton;
