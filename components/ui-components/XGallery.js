import React from "react";
import styles from "../../styles/components/XGallery.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

function XGallery({ content, props }) {
  const router = useRouter();
  return (
    <section className={styles.container}>
      <div className={styles.col}>
        <Link
          className={styles.square}
          href={content[0]?.link ? content[0]?.link : router.asPath}
        >
          <img
            src={
              content[0]?.image
                ? content[0]?.image
                : "/images/image-placeholder.jpg"
            }
          />
          <div className={styles.overlay}>
            <p className={styles.text}>
              {content[0]?.text ? content[0]?.text : "text"}
            </p>
          </div>
        </Link>
        <Link
          className={styles.rectangle}
          href={content[1]?.link ? content[1]?.link : router.asPath}
        >
          <img
            src={
              content[1]?.image
                ? content[1]?.image
                : "/images/image-placeholder.jpg"
            }
          />
          <div className={styles.overlay}>
            <p className={styles.text}>
              {content[1]?.text ? content[1]?.text : "text"}
            </p>
          </div>
        </Link>
      </div>
      <div className={styles.col}>
        <Link
          className={styles.rectangle}
          href={content[2]?.link ? content[2]?.link : router.asPath}
        >
          <img
            src={
              content[2]?.image
                ? content[2]?.image
                : "/images/image-placeholder.jpg"
            }
          />
          <div className={styles.overlay}>
            <p className={styles.text}>
              {content[2]?.text ? content[2]?.text : "text"}
            </p>
          </div>
        </Link>
        <Link
          className={styles.square}
          href={content[3]?.link ? content[3]?.link : router.asPath}
        >
          <img
            src={
              content[3]?.image
                ? content[3]?.image
                : "/images/image-placeholder.jpg"
            }
          />
          <div className={styles.overlay}>
            <p className={styles.text}>
              {content[3]?.text ? content[3]?.text : "text"}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default XGallery;
