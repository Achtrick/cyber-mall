import { CircularProgress, Drawer, IconButton } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import XBadge from "../../components/ui-components/XBadge";
import XHr from "../../components/ui-components/XHr";
import styles from "../../styles/shop/ShopHeader.module.scss";
import { deduceColor } from "../../utils/config/convertHelper";
import {
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MenuIcon,
  ResetIcon,
  SearchIcon,
  ShoppingCartIcon,
  TiktokIcon,
  YouTubeIcon,
} from "../../utils/theme/icons";

function ShopHeader({ shopInfo, ...props }) {
  const router = useRouter();
  const { carts } = useSelector((state) => state.cart);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (router.isReady) setSearchTerm(router.query.searchTerm);
    !categories.length && getCategories(shopInfo._id);
  }, [router]);

  const getCategories = async (shopId) => {
    setLoadingCategories(true);
    try {
      const { data } = await axios.post("/api/admin/categories/get", {
        shop: shopId,
      });
      setCategories(data);
      setLoadingCategories(false);
    } catch (error) {
      setLoadingCategories(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setTimeout(() => {
      document.getElementById("searchInput")?.focus();
    }, 0);
  };

  const navigateToSeacrh = (searchTerm) => {
    const pathname = router.pathname;
    let query = router.query;

    query = { ...query, searchTerm: searchTerm };
    if (pathname.includes("products")) {
      router.push({ pathname: pathname, query: query });
    } else {
      router.push(
        `/shop/products/?shop=${shopInfo.name}&searchTerm=${
          searchTerm ? searchTerm : ""
        }`
      );
    }

    setSearchOpen(false);
  };

  const restSearch = async () => {
    navigateToSeacrh("");
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
            style={{ width: "90%" }}
            onSubmit={(e) => {
              e.preventDefault();
              navigateToSeacrh(searchTerm);
            }}
          >
            <input
              id="searchInput"
              type="text"
              placeholder="what are you looking for ?"
              className="defaultInput"
              style={{
                border: `1px solid ${shopInfo.settings.primaryColor}`,
              }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </form>

          <div className={styles.controls}>
            {searchTerm && searchTerm !== "" ? (
              <IconButton
                style={{ color: shopInfo.settings.primaryColor }}
                onClick={restSearch}
              >
                <ResetIcon />
              </IconButton>
            ) : null}
            <IconButton
              style={{ color: shopInfo.settings.primaryColor }}
              onClick={() => navigateToSeacrh(searchTerm)}
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
            <div style={{ marginLeft: "5%" }}>
              <XHr width="90%" color={shopInfo.settings.secondaryColor} />
            </div>
            {loadingCategories ? (
              <CircularProgress />
            ) : (
              categories.map((category) => {
                return (
                  <Link
                    key={category._id}
                    href={`/shop/products/?shop=${shopInfo.name}&category=${category.name}`}
                    onClick={() => toggleDrawer()}
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
                      {category.name}
                    </div>
                  </Link>
                );
              })
            )}
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
                width={"100"}
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
          <XBadge
            color={shopInfo.settings.primaryColor}
            content={
              carts.find((cart) => cart.shop === shopInfo.name)?.content
                ?.length || 0
            }
          >
            <Link href={`/shop/cart?shop=${shopInfo.name}`}>
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
