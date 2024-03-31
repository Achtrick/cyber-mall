import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../styles/shop/ShopFooter.module.scss";
import { deduceColor } from "../../utils/config/convertHelper";
import {
  AddressIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneEnabledIcon,
  TiktokIcon,
  YouTubeIcon,
} from "../../utils/theme/icons";

function ShopFooter({ shopInfo }) {
  const [deducedColor, setDeducedColor] = useState("white");

  useEffect(() => {
    shopInfo && setDeducedColor(deduceColor(shopInfo.settings.footerColor));
  }, [shopInfo]);

  return (
    <div
      style={{
        backgroundColor: shopInfo.settings.footerColor,
        color: deducedColor,
        borderTop: `1px solid ${deducedColor}`,
      }}
      className={styles.footer}
    >
      <div className={styles.col}>
        <h3>réseaux sociaux</h3>
        {shopInfo.architecture.contact.socials.facebook !== "" && (
          <Link
            rel="noreferrer"
            target="_blank"
            href={shopInfo.architecture.contact.socials.facebook}
            className={styles.row}
          >
            <FacebookIcon />
            <span>facebook</span>
          </Link>
        )}

        {shopInfo.architecture.contact.socials.instagram !== "" && (
          <Link
            rel="noreferrer"
            target="_blank"
            href={shopInfo.architecture.contact.socials.instagram}
            className={styles.row}
          >
            <InstagramIcon />
            <span>instagram</span>
          </Link>
        )}

        {shopInfo.architecture.contact.socials.tiktok !== "" && (
          <Link
            rel="noreferrer"
            target="_blank"
            href={shopInfo.architecture.contact.socials.tiktok}
            className={styles.row}
          >
            <TiktokIcon />
            <span>tiktok</span>
          </Link>
        )}

        {shopInfo.architecture.contact.socials.youtube !== "" && (
          <Link
            rel="noreferrer"
            target="_blank"
            href={shopInfo.architecture.contact.socials.youtube}
            className={styles.row}
          >
            <YouTubeIcon />
            <span>youtube</span>
          </Link>
        )}

        {shopInfo.architecture.contact.socials.linkedIn !== "" && (
          <Link
            rel="noreferrer"
            target="_blank"
            href={shopInfo.architecture.contact.socials.linkedIn}
            className={styles.row}
          >
            <LinkedInIcon />
            <span>linkedIn</span>
          </Link>
        )}
      </div>
      <div className={styles.col}>
        <h3>contact</h3>
        <div className={styles.row}>
          {shopInfo.architecture.contact.address !== "" && (
            <>
              <AddressIcon />
              <p>{shopInfo.architecture.contact.address}</p>
            </>
          )}
        </div>
        <div className={styles.row}>
          {shopInfo.architecture.contact.direct.email !== "" && (
            <>
              <MailIcon />
              <p>{shopInfo.architecture.contact.direct.email}</p>
            </>
          )}
        </div>
        <div className={styles.row}>
          {shopInfo.architecture.contact.direct.phone !== "" && (
            <>
              <PhoneEnabledIcon />
              <p>{shopInfo.architecture.contact.direct.phone}</p>
            </>
          )}
        </div>
      </div>
      <div className={styles.col}>
        <h3>à propos</h3>
        {shopInfo.architecture.about !== "" && (
          <p>{shopInfo.architecture.about}</p>
        )}
      </div>
    </div>
  );
}

export default ShopFooter;
