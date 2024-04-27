import {
  CircularProgress,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import CartContent from "../shop/CartContent";

function ShopHeader({ shopInfo, ...props }) {
  const shop = shopInfo.name;
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:800px)");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { carts } = useSelector((state) => state.cart);
  const { cartPreviewOpen } = useSelector((state) => state.ui);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState(null);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (router.isReady) setSearchTerm(router.query.searchTerm);
    !categories.length && getCategories(shopInfo._id);
  }, [router]);

  useEffect(() => {
    if (shop) {
      setCart(carts?.find((cart) => cart.shop === shop));
    } else {
      enqueueSnackbar("Lien de shop invalide", { variant: "error" });
      router.push("/");
    }
  }, [carts]);

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

  const emptyCart = () => {
    dispatch({
      type: "EMPTY_CART",
      payload: {
        shop: shop,
      },
    });
    setCart(null);
  };

  const updateCart = async (product, action) => {
    dispatch({
      type: "UPDATE_CARTS",
      payload: {
        shop: shop,
        product: product,
        qtyAction: action,
      },
    });
  };

  const deleteProduct = (designation) => {
    dispatch({
      type: "DELETE_PRODUCT_CART",
      payload: {
        shop: shop,
        designation,
      },
    });
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    dispatch({ type: "CLOSE_CART_PREVIEW" });
  };

  const toggleCartPreview = () => {
    dispatch({ type: "TOGGLE_CART_PREVIEW" });
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
        `/shop/products/${shopInfo.name}?searchTerm=${
          searchTerm ? searchTerm : ""
        }`
      );
    }

    setSearchOpen(false);
  };

  const getCategoryPath = (categoryName) => {
    const pathname = router.pathname;
    let query = router.query;

    query = { ...query, category: categoryName };

    if (pathname.includes("products")) {
      return { pathname: pathname, query: query };
    } else {
      return `/shop/products/${shopInfo.name}?category=${categoryName}`;
    }
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
              placeholder="Qu'est-ce que vous cherchez ?"
              className="defaultInput"
              style={{
                border: `1px solid ${shopInfo.settings.primaryColor}`,
                fontSize: "12px",
                fontStyle: "italic",
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
            <Link href={`/shop/${shopInfo.name}`} onClick={toggleDrawer}>
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
                  e.target.style.backgroundColor = !router.pathname.includes(
                    "products"
                  )
                    ? "#25252521"
                    : "transparent";
                  e.target.style.color = "black";
                }}
                aria-selected={!router.pathname.includes("products")}
              >
                Accueil
              </div>
            </Link>
            <Link
              href={`/shop/products/${shopInfo.name}`}
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
                  e.target.style.backgroundColor =
                    router.pathname.includes("products") &&
                    !router.query["category"]
                      ? "#25252521"
                      : "transparent";
                  e.target.style.color = "black";
                }}
                aria-selected={
                  router.pathname.includes("products") &&
                  !router.query["category"]
                }
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
                    href={getCategoryPath(category.name)}
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
                        e.target.style.backgroundColor =
                          router.query["category"] === category.name
                            ? "#25252521"
                            : "transparent";
                        e.target.style.color = "black";
                      }}
                      aria-selected={router.query["category"] === category.name}
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
      <Drawer
        open={cartPreviewOpen}
        anchor={"right"}
        onClose={toggleCartPreview}
      >
        <div
          style={{
            overflowY: "auto",
            padding: "90px 10px 40px 10px",
            width: isMobile ? "85vw" : "50vw",
          }}
        >
          {cart?.content?.length ? (
            <CartContent
              cart={cart}
              shopInfo={shopInfo}
              deleteProduct={deleteProduct}
              updateCart={updateCart}
              emptyCart={emptyCart}
              proceedToCheckout={true}
              freeShippingCounter={true}
            />
          ) : (
            <>
              <h2>Votre panier est vide !</h2>
              <XHr width="60px" color={shopInfo.settings.primaryColor} />
            </>
          )}
        </div>
      </Drawer>
      <div
        className={styles.header}
        style={{
          backgroundColor: shopInfo.settings.headerColor,
          color: deduceColor(shopInfo.settings.headerColor),
          boxShadow: `0px 0px 2px ${deduceColor(
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
            <Link href={`/shop/${shopInfo.name}`}>
              <img
                alt={shopInfo.name}
                src={`/api/images/${shopInfo.logo.split("/").pop()}`}
                onError={(e) => {
                  e.target.src = "/images/image-placeholder.jpg";
                }}
                style={{
                  objectFit: "contain",
                  width: "150px",
                  height: "80px",
                }}
              />
            </Link>
          ) : (
            <Link href={`/shop/${shopInfo.name}`}>
              <div className="row">
                <Image
                  alt="logo"
                  src={"/images/default-store.png"}
                  width={"60"}
                  height={"60"}
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
          {cartPreviewOpen ? (
            <IconButton
              onClick={() =>
                !router.pathname.includes("cart") && toggleCartPreview()
              }
              color={deduceColor(shopInfo.settings.headerColor)}
            >
              <CloseIcon />
            </IconButton>
          ) : (
            <XBadge
              color={shopInfo.settings.primaryColor}
              content={
                carts?.find((cart) => cart.shop === shopInfo.name)?.content
                  ?.length || 0
              }
            >
              <IconButton
                onClick={() =>
                  !router.pathname.includes("cart") && toggleCartPreview()
                }
                color={deduceColor(shopInfo.settings.headerColor)}
              >
                <ShoppingCartIcon />
              </IconButton>
            </XBadge>
          )}
        </div>
      </div>
    </>
  );
}

export default ShopHeader;

export function getServerSideProps(context) {
  return {
    props: { shop: context.params.shop },
  };
}
