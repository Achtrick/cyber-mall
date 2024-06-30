import { useMediaQuery } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "../../styles/components/XGallery.module.scss";

function XGallery({ shopInfo, content, disabled, props }) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:800px)");
  const handleClick = (event) => {
    disabled && event.preventDefault();
  };
  return (
    <section className={styles.container}>
      <div className={styles.col}>
        <Link
          onClick={handleClick}
          className={styles.square}
          href={
            content[0]?.link.length
              ? content[0]?.link
              : content[0]?.category.length
              ? shopInfo?.domainName.length
                ? `/products?category=${content[0]?.category}`
                : `/${shopInfo.name}/products?category=${content[0]?.category}`
              : router.asPath
          }
          rel={content[0]?.link.length ? "noreferrer" : null}
          target={content[0]?.link.length ? "_blank" : null}
        >
          <img
            src={
              content[0]?.image.length
                ? `/api/images/${content[0]?.image.split("/").pop()}${
                    isMobile ? "?width=450&height=450" : "?width=900&height=900"
                  }`
                : "/images/image-placeholder.jpg"
            }
            onError={(e) => {
              e.target.src = "/images/image-placeholder.jpg";
            }}
            alt="gallery-item"
          />
          <div className={styles.overlay}>
            <p className={styles.text}>{content[0]?.text ?? "text"}</p>
          </div>
        </Link>
        <Link
          onClick={handleClick}
          className={styles.rectangle}
          href={
            content[1]?.link.length
              ? content[1]?.link
              : content[1]?.category.length
              ? shopInfo?.domainName.length
                ? `/products?category=${content[1]?.category}`
                : `/${shopInfo.name}/products?category=${content[1]?.category}`
              : router.asPath
          }
          rel={content[1]?.link.length ? "noreferrer" : null}
          target={content[1]?.link.length ? "_blank" : null}
        >
          <img
            src={
              content[1]?.image.length
                ? `/api/images/${content[1]?.image.split("/").pop()}${
                    isMobile ? "?width=450&height=450" : "?width=900&height=900"
                  }`
                : "/images/image-placeholder.jpg"
            }
            onError={(e) => {
              e.target.src = "/images/image-placeholder.jpg";
            }}
            alt="gallery-item"
          />
          <div className={styles.overlay}>
            <p className={styles.text}>{content[1]?.text ?? "text"}</p>
          </div>
        </Link>
      </div>
      <div className={styles.col}>
        <Link
          onClick={handleClick}
          className={styles.rectangle}
          href={
            content[2]?.link.length
              ? content[2]?.link
              : content[2]?.category.length
              ? shopInfo?.domainName.length
                ? `/products?category=${content[2]?.category}`
                : `/${shopInfo.name}/products?category=${content[2]?.category}`
              : router.asPath
          }
          rel={content[2]?.link.length ? "noreferrer" : null}
          target={content[2]?.link.length ? "_blank" : null}
        >
          <img
            src={
              content[2]?.image.length
                ? `/api/images/${content[2]?.image.split("/").pop()}${
                    isMobile ? "?width=450&height=450" : "?width=900&height=900"
                  }`
                : "/images/image-placeholder.jpg"
            }
            onError={(e) => {
              e.target.src = "/images/image-placeholder.jpg";
            }}
            alt="gallery-item"
          />
          <div className={styles.overlay}>
            <p className={styles.text}>{content[2]?.text ?? "text"}</p>
          </div>
        </Link>
        <Link
          onClick={handleClick}
          className={styles.square}
          href={
            content[3]?.link.length
              ? content[3]?.link
              : content[3]?.category.length
              ? shopInfo?.domainName.length
                ? `/products?category=${content[3]?.category}`
                : `/${shopInfo.name}/products?category=${content[3]?.category}`
              : router.asPath
          }
          rel={content[3]?.link.length ? "noreferrer" : null}
          target={content[3]?.link.length ? "_blank" : null}
        >
          <img
            src={
              content[3]?.image.length
                ? `/api/images/${content[3]?.image.split("/").pop()}${
                    isMobile ? "?width=450&height=450" : "?width=900&height=900"
                  }`
                : "/images/image-placeholder.jpg"
            }
            onError={(e) => {
              e.target.src = "/images/image-placeholder.jpg";
            }}
            alt="gallery-item"
          />
          <div className={styles.overlay}>
            <p className={styles.text}>{content[3]?.text ?? "text"}</p>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default XGallery;
