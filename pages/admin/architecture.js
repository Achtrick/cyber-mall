import { IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import CategoriesGrid from "../../components/shop/CategoriesGrid";
import ProductsSlider from "../../components/shop/ProductsSlider";
import HomeSlider from "../../components/shop/HomeSlider";
import XGallery from "../../components/ui-components/XGallery";
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";
import { compressImage } from "../../utils/config/convertHelper";
import { getError } from "../../utils/shared/getError";
import {
  AddIcon,
  AddressIcon,
  CheckCircleIcon,
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneEnabledIcon,
  SettingsIcon,
  TiktokIcon,
  YouTubeIcon,
} from "../../utils/theme/icons";

function Architecture(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const [architecture, setArchitecture] = useState({});
  const [logo, setLogo] = useState(null);

  const [action, setAction] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getShopInfo();
    getCategories();
    getDiscounts();
  }, []);

  const getShopInfo = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: userInfo.shop.name,
      });
      setShopInfo(data);
      setLogo(data.logo);
      setArchitecture(data.architecture);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.post("/api/admin/categories/get", {
        shop: userInfo.shop._id,
      });
      setCategories(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const getDiscounts = async () => {
    try {
      const { data } = await axios.post("/api/shop/get-random-discounts", {
        shopId: userInfo.shop._id,
      });
      setDiscounts(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const saveArchitecture = async (component) => {
    setLoading(true);
    try {
      let body = {};

      switch (component) {
        case "sliderComponent":
          body = architecture.home.sliderComponent;
          break;
        case "categoriesComponent":
          body = architecture.home.categoriesComponent;
          break;
        case "discountComponent":
          body = architecture.home.discountComponent;
          break;
        case "galleryComponent":
          body = architecture.home.galleryComponent;
          break;
        case "contactComponent":
          body = architecture.contact;
          break;
        case "aboutComponent":
          body = architecture.about;
          break;

        default:
          break;
      }

      const { data } = await axios.post("/api/admin/shop/update-architecture", {
        shopId: shopInfo._id,
        component: component,
        body: body,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const updateLogo = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/shop/update-logo", {
        shopId: shopInfo._id,
        logo: logo,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const closeAction = () => {
    setTitle("");
    setAction("");
  };

  // SLIDES FUNCTIONS
  const deleteSlide = (slide) => {
    setArchitecture({
      ...architecture,
      home: {
        ...architecture.home,
        sliderComponent: architecture?.home?.sliderComponent?.filter(
          (s) => s.image !== slide.image
        ),
      },
    });
  };

  const updateSlides = async (e) => {
    let compressedImages = architecture.home.sliderComponent;
    const images = e.target.files;
    for (let image of images) {
      const base64 = await compressImage(image);
      compressedImages.push({ link: "", image: base64 });
    }
    setArchitecture({
      ...architecture,
      home: {
        ...architecture.home,
        sliderComponent: compressedImages,
      },
    });
  };

  const updateSlideLink = async (e, slide) => {
    architecture.home.sliderComponent.find((s) => s === slide).link =
      e.target.value;
    setArchitecture({
      ...architecture,
    });
  };

  const updateSlideCategory = async (e, slide) => {
    architecture.home.sliderComponent.find((s) => s === slide).category =
      e.target.value;
    setArchitecture({
      ...architecture,
    });
  };

  // CATEGORIES GRID FUNCTIONS
  const updateCategoriesGrid = (e, attribute, categoryId) => {
    const selectedCategoriesIds =
      architecture.home.categoriesComponent.selectedCategoriesIds;

    switch (attribute) {
      case "visibleIndex":
        setArchitecture({
          ...architecture,
          home: {
            ...architecture.home,
            categoriesComponent: {
              ...architecture.home.categoriesComponent,
              visibleIndex: e.target.value,
            },
          },
        });
        break;
      case "selectedCategoriesIds":
        selectedCategoriesIds.includes(categoryId)
          ? selectedCategoriesIds.splice(
              selectedCategoriesIds.indexOf(categoryId),
              1
            )
          : selectedCategoriesIds.push(categoryId);
        setArchitecture({
          ...architecture,
          home: {
            ...architecture.home,
            categoriesComponent: {
              ...architecture.home.categoriesComponent,
              selectedCategoriesIds: selectedCategoriesIds,
            },
          },
        });
        break;

      default:
        break;
    }
  };

  // GALLERY FUNCTIONS
  const deleteBlock = (block) => {
    setArchitecture({
      ...architecture,
      home: {
        ...architecture.home,
        galleryComponent: {
          ...architecture?.home?.galleryComponent,
          content: architecture?.home?.galleryComponent?.content?.filter(
            (b) => b.image !== block.image
          ),
        },
      },
    });
  };

  const updateBlocks = async (e) => {
    let compressedImages = architecture.home.galleryComponent.content;
    const images = e.target.files;
    for (let image of images) {
      const base64 = await compressImage(image);

      compressedImages.push({ link: "", image: base64 });
    }
    setArchitecture({
      ...architecture,
      home: {
        ...architecture.home,
        galleryComponent: {
          ...architecture.home.galleryComponent,
          content: compressedImages,
        },
      },
    });
  };

  const updateBlock = async (e, block) => {
    architecture.home.galleryComponent.content.find((b) => b === block)[
      e.target.name
    ] = e.target.value;
    setArchitecture({
      ...architecture,
    });
  };

  // CONTACT FUNCTIONS
  const onSocialsChange = (e) => {
    setArchitecture({
      ...architecture,
      contact: {
        ...architecture.contact,
        socials: {
          ...architecture.contact.socials,
          [e.target.name]: e.target.value,
        },
      },
    });
  };

  // FORMS
  const sliderForm = (
    <form>
      <div className={styles.slidesContainer}>
        {architecture?.home?.sliderComponent.map((slide, index) => {
          return (
            <div key={index} className={styles.slidePreview}>
              <div className={styles.closeIcon}>
                <IconButton
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => deleteSlide(slide)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <img alt={index} src={slide.image} />

              <p>
                category link:{" "}
                <select
                  className="defaultInput"
                  value={slide.category}
                  onChange={(e) => updateSlideCategory(e, slide)}
                  disabled={slide.link && slide.link !== ""}
                  style={
                    slide.link && slide.link !== ""
                      ? { backgroundColor: "#ccc" }
                      : null
                  }
                >
                  <option value="">
                    Select a category (if you have a custom link it will
                    override this)
                  </option>
                  {categories.map((category) => {
                    return (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </p>
              <p>
                custom link:{" "}
                <input
                  type="text"
                  className="defaultInput"
                  value={slide.link}
                  onChange={(e) => updateSlideLink(e, slide)}
                />
              </p>
            </div>
          );
        })}
      </div>
      <input
        id="slides"
        hidden
        type="file"
        accept="image/*"
        multiple
        name="slides"
        max="3"
        onChange={updateSlides}
      />
      {architecture?.home?.sliderComponent?.length < 3 ? (
        <IconButton>
          <label
            style={{ cursor: "pointer", width: "25px", height: "25px" }}
            htmlFor="slides"
          >
            <AddIcon></AddIcon>
          </label>
        </IconButton>
      ) : null}
    </form>
  );

  const categoriesGridForm = (
    <form>
      <p>
        visible index: (this will determine the display order of this section on
        your home screen)
        <input
          type="number"
          min={0}
          className="defaultInput"
          value={architecture.home?.categoriesComponent?.visibleIndex}
          onChange={(e) => {
            updateCategoriesGrid(e, "visibleIndex");
          }}
        />
      </p>
      <br />
      <div className={styles.imagesContainer}>
        {categories?.map((category, index) => {
          return (
            <div key={index} className={styles.imgPreview}>
              <div className={styles.closeIcon}>
                <IconButton
                  style={{ width: "30px", height: "30px" }}
                  onClick={(e) => {
                    updateCategoriesGrid(
                      e,
                      "selectedCategoriesIds",
                      category._id
                    );
                  }}
                >
                  <CheckCircleIcon
                    color={
                      architecture?.home?.categoriesComponent?.selectedCategoriesIds?.includes(
                        category._id
                      )
                        ? "info"
                        : "default"
                    }
                  />
                </IconButton>
              </div>
              <img alt={index} src={category.icon} />
            </div>
          );
        })}
      </div>
    </form>
  );

  const discountsSectionForm = (
    <form>
      <p>
        visible index: (this will determine the display order of this section on
        your home screen)
        <input
          type="number"
          min={0}
          className="defaultInput"
          value={architecture.home?.discountComponent?.visibleIndex}
          onChange={(e) => {
            setArchitecture({
              ...architecture,
              home: {
                ...architecture.home,
                discountComponent: {
                  ...architecture.home.discountComponent,
                  visibleIndex: e.target.value,
                },
              },
            });
          }}
        />
      </p>
    </form>
  );

  const galleryForm = (
    <form>
      <p>
        visible index: (this will determine the display order of this section on
        your home screen)
        <input
          type="number"
          min={0}
          className="defaultInput"
          value={architecture.home?.galleryComponent?.visibleIndex}
          onChange={(e) => {
            setArchitecture({
              ...architecture,
              home: {
                ...architecture.home,
                galleryComponent: {
                  ...architecture.home.galleryComponent,
                  visibleIndex: e.target.value,
                },
              },
            });
          }}
        />
      </p>
      <br />
      <div className={styles.slidesContainer}>
        {architecture?.home?.galleryComponent?.content?.map((block, index) => {
          return (
            <div key={index} className={styles.slidePreview}>
              <div className={styles.closeIcon}>
                <IconButton
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => deleteBlock(block)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <img alt={index} src={block.image} />
              <p>
                link:
                <input
                  type="text"
                  name="link"
                  className="defaultInput"
                  value={block.link}
                  onChange={(e) => updateBlock(e, block)}
                />
              </p>
              <p>
                text:
                <input
                  type="text"
                  name="text"
                  className="defaultInput"
                  value={block.text}
                  onChange={(e) => updateBlock(e, block)}
                />
              </p>
            </div>
          );
        })}
      </div>
      <input
        id="blocks"
        hidden
        type="file"
        accept="image/*"
        multiple
        name="blocks"
        max="3"
        onChange={updateBlocks}
      />
      {architecture?.home?.galleryComponent?.content?.length < 4 ? (
        <IconButton>
          <label
            style={{ cursor: "pointer", width: "25px", height: "25px" }}
            htmlFor="blocks"
          >
            <AddIcon></AddIcon>
          </label>
        </IconButton>
      ) : null}
    </form>
  );

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <XModal
          open={action !== ""}
          title={title}
          onClose={closeAction}
          cancelAction={closeAction}
          size={
            action === "SLIDER-FORM" || action === "GALLERY-FORM"
              ? ModalSizes.BIG
              : action === "CATEGORIES-GRID-FORM"
              ? ModalSizes.MEDIUM
              : action === "DISCOUNT-FORM"
              ? ModalSizes.SMALL
              : null
          }
          hideControls={true}
        >
          <div className={styles.modal}>
            {action === "SLIDER-FORM"
              ? sliderForm
              : action === "CATEGORIES-GRID-FORM"
              ? categoriesGridForm
              : action === "DISCOUNT-FORM"
              ? discountsSectionForm
              : action === "GALLERY-FORM"
              ? galleryForm
              : null}
          </div>
        </XModal>
        <section className={styles.container}>
          <h1>Configure your shop to your taste</h1>
          <p>
            - when you finish click on the{" "}
            <IconButton disabled>
              <CheckCircleIcon />
            </IconButton>{" "}
            icon to save your settings
          </p>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 200px)"}
            />
          ) : (
            <div className={styles.container}>
              <h1>Logo</h1>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                {logo ? (
                  <Image
                    alt="logo"
                    src={logo}
                    width={"100"}
                    height={"100"}
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <Image
                    alt="logo"
                    src={"/images/default-store.png"}
                    width={"100"}
                    height={"100"}
                    style={{ objectFit: "contain" }}
                  />
                )}
                <input
                  id="logo"
                  hidden
                  type="file"
                  accept="image/*"
                  name="logo"
                  onChange={async (e) => {
                    const base64 = await compressImage(e.target.files[0]);
                    setLogo(base64);
                  }}
                />
                &nbsp;&nbsp;
                <IconButton color="info">
                  <label
                    style={{ cursor: "pointer", width: "25px", height: "25px" }}
                    htmlFor="logo"
                  >
                    <SettingsIcon />
                  </label>
                </IconButton>{" "}
                |{" "}
                <IconButton color="info" onClick={updateLogo}>
                  <label
                    style={{ cursor: "pointer", width: "25px", height: "25px" }}
                  >
                    <CheckCircleIcon />
                  </label>
                </IconButton>{" "}
              </div>
              <br />
              <hr />
              <h1>Home Page</h1>
              <p>
                - slider (recommended resolution is 1500 x 600){" "}
                <IconButton
                  color="info"
                  onClick={() => {
                    setTitle("select home slider images");
                    setAction("SLIDER-FORM");
                  }}
                >
                  <SettingsIcon />
                </IconButton>{" "}
                |{" "}
                <IconButton
                  color="info"
                  onClick={() => saveArchitecture("sliderComponent")}
                >
                  <CheckCircleIcon />
                </IconButton>{" "}
              </p>
              <HomeSlider
                slides={
                  architecture.home.sliderComponent.length
                    ? architecture.home.sliderComponent
                    : [
                        {
                          link: "",
                          image: "/images/image-placeholder.jpg",
                        },
                      ]
                }
              />
              <br />
              <hr />
              <p>
                - categories grid (select up to 6 categories){" "}
                <IconButton
                  color="info"
                  onClick={() => {
                    setTitle("select categories to show in the grid");
                    setAction("CATEGORIES-GRID-FORM");
                  }}
                >
                  <SettingsIcon />
                </IconButton>{" "}
                |{" "}
                <IconButton
                  color="info"
                  onClick={() => saveArchitecture("categoriesComponent")}
                >
                  <CheckCircleIcon />
                </IconButton>{" "}
              </p>
              {categories.length ? (
                <CategoriesGrid
                  activateControls={false}
                  categories={categories}
                  architecture={architecture}
                  shopName={shopInfo.name}
                />
              ) : (
                <section
                  style={{
                    width: "100%",
                    padding: "10px",
                  }}
                >
                  <h2 align="center">Discover Our Catgegories</h2>
                  <div
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "auto auto auto auto auto auto ",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                  </div>
                </section>
              )}
              <br />
              <hr />
              <p>
                - discount section (this will show random discounted products
                for fast purchase)
                <IconButton
                  color="info"
                  onClick={() => {
                    setTitle("set the display order of the discounts section");
                    setAction("DISCOUNT-FORM");
                  }}
                >
                  <SettingsIcon />
                </IconButton>{" "}
                |{" "}
                <IconButton
                  color="info"
                  onClick={() => saveArchitecture("discountComponent")}
                >
                  <CheckCircleIcon />
                </IconButton>{" "}
              </p>
              {discounts.length ? (
                <ProductsSlider
                  activateControls={false}
                  products={discounts}
                  shopName={shopInfo.name}
                  settings={shopInfo.settings}
                  title={"Get More For Less !"}
                />
              ) : (
                <section
                  style={{
                    width: "100%",
                    padding: "10px",
                  }}
                >
                  <h2 align="center">Get More For Less !</h2>
                  <div
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "auto auto auto auto auto auto ",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        src="/images/image-placeholder.jpg"
                      />
                    </div>
                  </div>
                </section>
              )}
              <br />
              <hr />
              <p>
                - gallery component (this will show selected images with each
                one containing a title that shows on hover)
                <IconButton
                  color="info"
                  onClick={() => {
                    setTitle("set the images for your gallery");
                    setAction("GALLERY-FORM");
                  }}
                >
                  <SettingsIcon />
                </IconButton>{" "}
                |{" "}
                <IconButton
                  color="info"
                  onClick={() => saveArchitecture("galleryComponent")}
                >
                  <CheckCircleIcon />
                </IconButton>{" "}
              </p>
              <XGallery content={architecture.home.galleryComponent.content} />
              <br />
              <hr />
              <h1>Contact Info</h1>
              <p>
                - fill your contacts infos
                <IconButton
                  color="info"
                  onClick={() => saveArchitecture("contactComponent")}
                >
                  <CheckCircleIcon />
                </IconButton>{" "}
              </p>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <AddressIcon />
                &nbsp;
                <input
                  name="address"
                  placeholder="address"
                  value={architecture.contact.address}
                  onChange={(e) => {
                    setArchitecture({
                      ...architecture,
                      contact: {
                        ...architecture.contact,
                        address: e.target.value,
                      },
                    });
                  }}
                  className="defaultInput"
                  style={{ width: "300px" }}
                />
              </div>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <MailIcon />
                &nbsp;
                <input
                  type="mail"
                  name="email"
                  placeholder="email"
                  value={architecture.contact.direct.email}
                  onChange={(e) => {
                    setArchitecture({
                      ...architecture,
                      contact: {
                        ...architecture.contact,
                        direct: {
                          ...architecture.contact.direct,
                          email: e.target.value,
                        },
                      },
                    });
                  }}
                  className="defaultInput"
                  style={{ width: "300px" }}
                />
              </div>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <PhoneEnabledIcon />
                &nbsp;
                <input
                  type="number"
                  name="phone"
                  placeholder="phone"
                  value={architecture.contact.direct.phone}
                  onChange={(e) => {
                    setArchitecture({
                      ...architecture,
                      contact: {
                        ...architecture.contact,
                        direct: {
                          ...architecture.contact.direct,
                          phone: e.target.value,
                        },
                      },
                    });
                  }}
                  className="defaultInput"
                  style={{ width: "300px" }}
                />
              </div>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <FacebookIcon />
                &nbsp;
                <input
                  name="facebook"
                  placeholder="facebook"
                  value={architecture.contact.socials.facebook}
                  onChange={onSocialsChange}
                  className="defaultInput"
                  style={{ width: "300px" }}
                />
              </div>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <InstagramIcon />
                &nbsp;
                <input
                  name="instagram"
                  placeholder="instagram"
                  value={architecture.contact.socials.instagram}
                  onChange={onSocialsChange}
                  className="defaultInput"
                  style={{ width: "300px" }}
                />
              </div>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <TiktokIcon />
                &nbsp;
                <input
                  name="tiktok"
                  placeholder="tiktok"
                  value={architecture.contact.socials.tiktok}
                  onChange={onSocialsChange}
                  className="defaultInput"
                  style={{ width: "300px" }}
                />
              </div>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <YouTubeIcon />
                &nbsp;
                <input
                  name="youtube"
                  placeholder="youtube"
                  value={architecture.contact.socials.youtube}
                  onChange={onSocialsChange}
                  className="defaultInput"
                  style={{ width: "300px" }}
                />
              </div>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <LinkedInIcon />
                &nbsp;
                <input
                  name="linkedIn"
                  placeholder="linkedIn"
                  value={architecture.contact.socials.linkedIn}
                  onChange={onSocialsChange}
                  className="defaultInput"
                  style={{ width: "300px" }}
                />
              </div>
              <br />
              <hr />
              <h1>About Info</h1>
              <p>
                - who are you and what do you sell ?
                <IconButton
                  color="info"
                  onClick={() => saveArchitecture("aboutComponent")}
                >
                  <CheckCircleIcon />
                </IconButton>{" "}
              </p>
              <textarea
                rows={5}
                name="about"
                placeholder="i am a company and i sell awesome stuff"
                value={architecture.about}
                onChange={(e) => {
                  setArchitecture({ ...architecture, about: e.target.value });
                }}
                className="defaultInput"
                style={{ width: "500px", height: "100px" }}
              />
            </div>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Architecture;
