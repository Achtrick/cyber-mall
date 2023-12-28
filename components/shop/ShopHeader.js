import { Drawer, IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import XBadge from "../../components/ui-components/XBadge";
import styles from "../../styles/shop/ShopHeader.module.scss";
import { deduceColor } from "../../utils/config/convertHelper";
import {
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
  TiktokIcon,
  YouTubeIcon,
} from "../../utils/theme/icons";
import { useRouter } from "next/router";

function ShopHeader({ shopInfo, ...props }) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const navigateToSeacrh = (e) => {
    e.preventDefault();
    router.push(
      `/shop/products/?shop=${shopInfo.name}&searchTerm=${searchTerm}`
    );
    setSearchOpen(false);
  };

  return (
    <>
      <Drawer
        open={searchOpen}
        anchor={"top"}
        onClose={toggleSearch}
        sx={{ zIndex: "3000" }}
      >
        <section className={styles.search}>
          <form
            id="search"
            onSubmit={navigateToSeacrh}
            style={{ width: "90%" }}
          >
            <input
              type="text"
              placeholder="what are you looking for ?"
              className="defaultInput"
              style={{ border: `1px solid ${shopInfo.settings.primaryColor}` }}
              value={searchTerm}
              required
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </form>
          <div className={styles.controls}>
            <IconButton
              form="search"
              type="submit"
              style={{ color: shopInfo.settings.primaryColor }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              style={{ color: shopInfo.settings.primaryColor }}
              onClick={toggleSearch}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </section>
      </Drawer>
      <Drawer open={drawerOpen} anchor={"left"} onClose={toggleDrawer}>
        <section className={styles.drawer}>
          <div className={styles.container}>
            <Link href={`/shop?shop=${shopInfo.name}`} onClick={toggleDrawer}>
              <div
                className={styles.link}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor =
                    shopInfo.settings.primaryColor;
                  e.target.style.color = deduceColor(
                    shopInfo.settings.primaryColor
                  );
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "black";
                }}
              >
                home
              </div>
            </Link>
            <Link
              href={`/shop/products?shop=${shopInfo.name}`}
              onClick={toggleDrawer}
            >
              <div
                className={styles.link}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor =
                    shopInfo.settings.primaryColor;
                  e.target.style.color = deduceColor(
                    shopInfo.settings.primaryColor
                  );
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "black";
                }}
              >
                shop
              </div>
            </Link>
            <div className={styles.socials}>
              {shopInfo.architecture.contact.socials.facebook !== "" && (
                <Link
                  rel="noreferrer"
                  target="_blank"
                  href={shopInfo.architecture.contact.socials.facebook}
                >
                  <FacebookIcon />
                </Link>
              )}

              {shopInfo.architecture.contact.socials.instagram !== "" && (
                <Link
                  rel="noreferrer"
                  target="_blank"
                  href={shopInfo.architecture.contact.socials.instagram}
                >
                  <InstagramIcon />
                </Link>
              )}

              {shopInfo.architecture.contact.socials.tiktok !== "" && (
                <Link
                  rel="noreferrer"
                  target="_blank"
                  href={shopInfo.architecture.contact.socials.tiktok}
                >
                  <TiktokIcon />
                </Link>
              )}

              {shopInfo.architecture.contact.socials.youtube !== "" && (
                <Link
                  rel="noreferrer"
                  target="_blank"
                  href={shopInfo.architecture.contact.socials.youtube}
                >
                  <YouTubeIcon />
                </Link>
              )}
              {shopInfo.architecture.contact.socials.linkedIn !== "" && (
                <Link
                  rel="noreferrer"
                  target="_blank"
                  href={shopInfo.architecture.contact.socials.linkedIn}
                >
                  <LinkedInIcon />
                </Link>
              )}
            </div>
          </div>
        </section>
      </Drawer>
      <div
        className={styles.header}
        style={{
          backgroundColor: shopInfo.settings.headerColor,
          color: deduceColor(shopInfo.settings.headerColor),
          borderBottom: `1px solid ${deduceColor(
            shopInfo.settings.headerColor
          )}`,
        }}
      >
        <div className={styles.menu}>
          <IconButton
            color={deduceColor(shopInfo.settings.headerColor)}
            onClick={toggleDrawer}
          >
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
        <div className={styles.logo}>
          {shopInfo.logo ? (
            <Link href={`/shop?shop=${shopInfo.name}`}>
              <Image
                alt="logo"
                src={shopInfo.logo}
                width={"60"}
                height={"60"}
                style={{
                  objectFit: "contain",
                }}
              />
            </Link>
          ) : (
            <Link href={`/shop?shop=${shopInfo.name}`}>
              <div className="row">
                <Image
                  alt="logo"
                  src={"/images/default-store.png"}
                  width={"40"}
                  height={"40"}
                  style={{
                    objectFit: "contain",
                    backgroundColor: "white",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                />
                &nbsp;
                <p
                  style={{
                    color: deduceColor(shopInfo.settings.headerColor),
                  }}
                >
                  {shopInfo.name}
                </p>
              </div>
            </Link>
          )}
        </div>
        <div className={styles.controls}>
          <IconButton
            color={deduceColor(shopInfo.settings.headerColor)}
            onClick={toggleSearch}
          >
            <SearchIcon />
          </IconButton>
          &nbsp;&nbsp;
          <XBadge color={shopInfo.settings.primaryColor} content={5}>
            <Link href={`shop/cart/?shop=${shopInfo.name}`}>
              <IconButton color={deduceColor(shopInfo.settings.headerColor)}>
                <ShoppingCartIcon />
              </IconButton>
            </Link>
          </XBadge>
        </div>
      </div>
    </>
  );
}

export default ShopHeader;
