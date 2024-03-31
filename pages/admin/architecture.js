import { IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import CategoriesGrid from "../../components/shop/CategoriesGrid";
import HomeSlider from "../../components/shop/HomeSlider";
import ProductsSlider from "../../components/shop/ProductsSlider";
import XGallery from "../../components/ui-components/XGallery";
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";
import {
  compressImage,
  getThumbnail,
  isBase64,
} from "../../utils/config/convertHelper";
import { checkExpirity } from "../../utils/shared/checkExpirity";
import { getError } from "../../utils/shared/getError";
import {
  AddIcon,
  AddressIcon,
  ChangeCircleIcon,
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
import XGridSkeleton from "./../../components/ui-components/XGridSkeleton";

function Architecture(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [loadingSlider, setLoadingSlider] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [shopInfo, setShopInfo] = useState({});
  const [sliderInfo, setSliderInfo] = useState([]);
  const [slide, setSlide] = useState({ image: "", link: "", category: "" });
  const [slideImage, setSlideImage] = useState(null);
  const [slideImageLoading, setSlideImageLoading] = useState(false);
  const [galleryItem, setGalleryItem] = useState({
    image: "",
    link: "",
    text: "",
    category: "",
  });
  const [galleryItemImage, setGalleryItemImage] = useState(null);
  const [galleryItemImageLoading, setGalleryItemImageLoading] = useState(false);
  const [galleryInfo, setGalleryInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [architecture, setArchitecture] = useState({});
  const [logo, setLogo] = useState(null);
  const [compressedLogo, setCompressedLogo] = useState(null);

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
        getHomeInfo: true,
      });
      setShopInfo(data);
      setLogo(data.logo);
      setArchitecture(data.architecture);
      getSliderInfo(data.name);
      getGalleryInfo(data.name);
      setLoading(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const getSliderInfo = async (shopName) => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: shopName,
        getHomeInfo: true,
        excludedSection: "galleryComponent",
      });

      setSliderInfo(data.architecture.home.sliderComponent);
      setLoadingSlider(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const getGalleryInfo = async (shopName) => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: shopName,
        getHomeInfo: true,
        excludedSection: "sliderComponent",
      });

      setGalleryInfo(data.architecture.home.galleryComponent);
      setLoadingGallery(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.post("/api/admin/categories/get", {
        shop: userInfo.shop._id,
      });
      setCategories(data);
    } catch (error) {
      checkExpirity(error, dispatch);
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
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const saveArchitecture = async (component) => {
    setLoading(true);
    try {
      let body = {};

      switch (component) {
        case "sliderComponent":
          body =
            action === "DELETE-SLIDE-FORM"
              ? sliderInfo.filter((s) => s.image !== slide.image)
              : sliderInfo;
          break;
        case "categoriesComponent":
          body = architecture.home.categoriesComponent;
          break;
        case "discountComponent":
          body = architecture.home.discountComponent;
          break;
        case "galleryComponent":
          body =
            action === "DELETE-GALLERY-FORM"
              ? {
                  ...galleryInfo,
                  content: galleryInfo.content.filter(
                    (s) => s.image !== galleryItem.image
                  ),
                }
              : galleryInfo;
          break;
        case "shippingFee":
          body = {
            shippingFee: shopInfo.shippingFee,
            freeShipping: shopInfo.freeShipping,
          };
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
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const updateLogo = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("images", compressedLogo);
    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: { "content-type": "multipart/form-data" },
      });
      const result = await axios.post("/api/admin/shop/update-logo", {
        shopId: shopInfo._id,
        logo: "/uploads/" + data[0].filename,
      });
      setCompressedLogo(null);
      enqueueSnackbar(result.data.message, { variant: "success" });
      setLoading(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const closeAction = () => {
    setTitle("");
    setAction("");
    setSlide({ image: "", link: "", category: "" });
    setSlideImage(null);
    setGalleryItem({ image: "", link: "", text: "", category: "" });
    setGalleryItemImage(null);
  };

  // SLIDES FUNCTIONS
  const addSlide = async (e) => {
    if (slideImage) {
      const formData = new FormData();
      formData.append("images", slideImage);

      setSlideImageLoading(true);
      try {
        const { data } = await axios.post("/api/upload", formData, {
          headers: { "content-type": "multipart/form-data" },
        });
        sliderInfo.push({ ...slide, image: "/uploads/" + data[0].filename });
        await saveArchitecture("sliderComponent");
        setSlideImageLoading(false);
        closeAction();
      } catch (error) {
        checkExpirity(error, dispatch);
        enqueueSnackbar(getError(error), { variant: "error" });
        setSlideImageLoading(false);
      }
    } else {
      enqueueSnackbar("l'image de la diapositive est requise", {
        variant: "warning",
      });
    }
  };

  const deleteSlide = async () => {
    setSliderInfo(sliderInfo.filter((s) => s.image !== slide.image));
    await saveArchitecture("sliderComponent");
    closeAction();
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
  const addGalleryItem = async (e) => {
    if (galleryItemImage) {
      const formData = new FormData();
      formData.append("images", galleryItemImage);

      setGalleryItemImageLoading(true);
      try {
        const { data } = await axios.post("/api/upload", formData, {
          headers: { "content-type": "multipart/form-data" },
        });
        galleryInfo.content.push({
          ...galleryItem,
          image: "/uploads/" + data[0].filename,
        });
        await saveArchitecture("galleryComponent");
        setGalleryItemImageLoading(false);
        closeAction();
      } catch (error) {
        checkExpirity(error, dispatch);
        enqueueSnackbar(getError(error), { variant: "error" });
        setGalleryItemImageLoading(false);
      }
    } else {
      enqueueSnackbar("l'image de l'élément de la galerie est requise", {
        variant: "warning",
      });
    }
  };

  const deleteGalleryItem = async () => {
    setGalleryInfo({
      ...galleryInfo,
      content: galleryInfo.content.filter((s) => s.image !== galleryItem.image),
    });
    await saveArchitecture("galleryComponent");
    closeAction();
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
  const addSliderForm = (
    <form>
      <div className={styles.slideContainer}>
        <div className={styles.slidePreview}>
          {slide.image.length ? (
            <img
              alt={slide.image}
              src={`/api/images/${slide.image.split("/").pop()}`}
              onError={(e) => {
                e.target.src = isBase64(slide.image)
                  ? slide.image
                  : "/images/default-placeholder.jpg";
              }}
            />
          ) : null}
          <IconButton
            color="success"
            style={{ width: "35px", height: "35px", marginBottom: "20px" }}
          >
            <label
              style={{ cursor: "pointer", width: "25px", height: "25px" }}
              htmlFor="slide"
            >
              {slide.image.length ? (
                <ChangeCircleIcon></ChangeCircleIcon>
              ) : (
                <AddIcon></AddIcon>
              )}
            </label>
          </IconButton>
          <p>
            lien de catégorie:{" "}
            <select
              className="defaultInput"
              value={slide.category}
              onChange={(e) => setSlide({ ...slide, category: e.target.value })}
              disabled={slide.link && slide.link !== ""}
              style={
                slide.link && slide.link !== ""
                  ? { backgroundColor: "#ccc" }
                  : null
              }
            >
              <option value="">
                Sélectionnez une catégorie (si vous avez un lien personnalisé,
                il remplacera ce)
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
            lien personnalisé:{" "}
            <input
              type="text"
              className="defaultInput"
              value={slide.link}
              onChange={(e) => setSlide({ ...slide, link: e.target.value })}
            />
          </p>
        </div>
      </div>
      <input
        id="slide"
        hidden
        type="file"
        accept="image/*"
        onChange={async (e) => {
          setSlide({ ...slide, image: await getThumbnail(e.target.files[0]) });
          setSlideImage(await compressImage(e.target.files[0]));
        }}
      />
    </form>
  );

  const deleteSlideForm = (
    <div>
      <p>êtes-vous sûr de vouloir supprimer cette diapositive ?</p>
    </div>
  );

  const categoriesGridForm = (
    <form>
      <p>
        index visible : (cela déterminera l&apos;ordre d&apos;affichage de cette
        section sur votre page d&apos;accueil)
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
              <img
                alt={index}
                src={`/api/images/${category.icon.split("/").pop()}`}
                onError={(e) => {
                  e.target.src = "/images/category.svg";
                }}
              />
            </div>
          );
        })}
      </div>
    </form>
  );

  const discountsSectionForm = (
    <form>
      <p>
        index visible : (cela déterminera l&apos;ordre d&apos;affichage de cette
        section sur votre page d&apos;accueil)
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

  const addGalleryForm = (
    <form>
      <div className={styles.slideContainer}>
        <div className={styles.slidePreview}>
          {galleryItem.image.length ? (
            <img
              alt={galleryItem.image}
              src={`/api/images/${galleryItem.image.split("/").pop()}`}
              onError={(e) => {
                e.target.src = isBase64(galleryItem.image)
                  ? galleryItem.image
                  : "/images/image-placeholder.jpg";
              }}
            />
          ) : null}
          <IconButton
            color="success"
            style={{ width: "35px", height: "35px", marginBottom: "20px" }}
          >
            <label
              style={{ cursor: "pointer", width: "25px", height: "25px" }}
              htmlFor="item"
            >
              {galleryItem.image.length ? (
                <ChangeCircleIcon></ChangeCircleIcon>
              ) : (
                <AddIcon></AddIcon>
              )}
            </label>
          </IconButton>
          <p>
            text:
            <input
              type="text"
              className="defaultInput"
              value={galleryItem.text}
              onChange={(e) =>
                setGalleryItem({ ...galleryItem, text: e.target.value })
              }
            />
          </p>
          <p>
            lien de catégorie:{" "}
            <select
              className="defaultInput"
              value={galleryItem.category}
              onChange={(e) =>
                setGalleryItem({ ...galleryItem, category: e.target.value })
              }
              disabled={galleryItem.link && galleryItem.link !== ""}
              style={
                galleryItem.link && galleryItem.link !== ""
                  ? { backgroundColor: "#ccc" }
                  : null
              }
            >
              <option value="">
                Sélectionnez une catégorie (si vous avez un lien personnalisé,
                il remplacera ce)
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
            lien personnalisé:
            <input
              type="text"
              className="defaultInput"
              value={galleryItem.link}
              onChange={(e) =>
                setGalleryItem({ ...galleryItem, link: e.target.value })
              }
            />
          </p>
        </div>
      </div>
      <input
        id="item"
        hidden
        type="file"
        accept="image/*"
        multiple
        max="3"
        onChange={async (e) => {
          setGalleryItem({
            ...galleryItem,
            image: await getThumbnail(e.target.files[0]),
          });
          setGalleryItemImage(await compressImage(e.target.files[0]));
        }}
      />
    </form>
  );

  const deleteGalleryForm = (
    <div>
      <p>êtes-vous sûr de vouloir supprimer cet élément de la galerie ?</p>
    </div>
  );

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <XModal
          open={action !== ""}
          title={title}
          onClose={closeAction}
          cancelAction={closeAction}
          confirmAction={
            action === "ADD-SLIDE-FROM"
              ? addSlide
              : action === "DELETE-SLIDE-FORM"
              ? deleteSlide
              : action === "ADD-GALLERY-FROM"
              ? addGalleryItem
              : action === "DELETE-GALLERY-FORM"
              ? deleteGalleryItem
              : null
          }
          loading={galleryItemImageLoading || slideImageLoading || loading}
          size={
            action === "ADD-SLIDE-FROM" || action === "ADD-GALLERY-FROM"
              ? ModalSizes.BIG
              : action === "CATEGORIES-GRID-FORM"
              ? ModalSizes.MEDIUM
              : action === "DISCOUNT-FORM" ||
                action === "DELETE-SLIDE-FORM" ||
                action === "DELETE-GALLERY-FORM"
              ? ModalSizes.SMALL
              : null
          }
          hideControls={
            action === "CATEGORIES-GRID-FORM" || action === "DISCOUNT-FORM"
          }
        >
          <div className={styles.modal}>
            {action === "ADD-SLIDE-FROM"
              ? addSliderForm
              : action === "DELETE-SLIDE-FORM"
              ? deleteSlideForm
              : action === "ADD-GALLERY-FROM"
              ? addGalleryForm
              : action === "DELETE-GALLERY-FORM"
              ? deleteGalleryForm
              : action === "CATEGORIES-GRID-FORM"
              ? categoriesGridForm
              : action === "DISCOUNT-FORM"
              ? discountsSectionForm
              : null}
          </div>
        </XModal>
        <section className={styles.container}>
          <div style={{ padding: "10px" }}>
            <h1>Configurez votre shop à votre goût</h1>
            <p>
              lorsque vous avez terminé, cliquez sur le{" "}
              <IconButton disabled>
                <CheckCircleIcon />
              </IconButton>{" "}
              icône pour enregistrer vos paramètres
            </p>
          </div>
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
                    onError={(e) => {
                      setLogo("/images/default-store.png");
                    }}
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
                    const base64 = await getThumbnail(e.target.files[0]);
                    const compressed = await compressImage(e.target.files[0]);
                    setLogo(base64);
                    setCompressedLogo(compressed);
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
                <IconButton
                  disabled={!compressedLogo}
                  color="info"
                  onClick={updateLogo}
                >
                  <label
                    style={{ cursor: "pointer", width: "25px", height: "25px" }}
                  >
                    <CheckCircleIcon />
                  </label>
                </IconButton>{" "}
              </div>
              <br />
              <br />
              <hr />
              <br />
              <br />
              <h1>Page D&apos;Accueil</h1>
              <p>Glissière (la résolution recommandée est de 1500 x 600)</p>
              {loadingSlider ? (
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"50vh"}
                />
              ) : (
                <>
                  <div className={styles.imagesContainer}>
                    {sliderInfo.map((slide) => {
                      return (
                        <div
                          key={slide.image}
                          className={styles.imgPreview}
                          style={{
                            width: "90%",
                            border: "1px solid #ccc",
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          <span className={styles.closeIcon}>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setSlide(slide);
                                setTitle("supprimer la diapositive");
                                setAction("DELETE-SLIDE-FORM");
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </span>
                          <img
                            src={`/api/images/${slide.image.split("/").pop()}`}
                            onError={(e) => {
                              e.target.src = "/images/image-placeholder.jpg";
                            }}
                          />
                          {slide.link.length ? <p>lien personnalisé</p> : null}
                          {slide.category.length ? (
                            <p>catégorie: {slide.category}</p>
                          ) : null}
                        </div>
                      );
                    })}
                    {sliderInfo?.length < 3 ||
                    userInfo?.shop.pack.type === "PREMIUM" ? (
                      <IconButton
                        color="success"
                        onClick={() => {
                          setTitle("Ajouter diapositive");
                          setAction("ADD-SLIDE-FROM");
                        }}
                        sx={{
                          width: "45px",
                          height: "45px",
                          margin: "30px",
                        }}
                      >
                        <label
                          style={{
                            cursor: "pointer",
                            width: "25px",
                            height: "25px",
                          }}
                        >
                          <AddIcon></AddIcon>
                        </label>
                      </IconButton>
                    ) : null}
                  </div>
                  <br />
                  <br />
                  <p>Aperçu</p>
                  <HomeSlider
                    slides={
                      sliderInfo.length
                        ? sliderInfo
                        : [
                            {
                              link: "",
                              image: "image-placeholder.jpg",
                            },
                          ]
                    }
                    shopName={shopInfo.name}
                  />
                </>
              )}
              <br />
              <br />
              <hr />
              <br />
              <br />
              <br />
              <p>
                grille de catégories (sélectionnez jusqu&apos;à 6 catégories){" "}
                <IconButton
                  color="info"
                  onClick={() => {
                    setTitle(
                      "sélectionner les catégories à afficher dans la grille"
                    );
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
                <XGridSkeleton title={"Découvrir Nos Catégories"} />
              )}
              <br />
              <br />
              <hr />
              <br />
              <br />
              <p>
                section de réduction (cela affichera des produits à prix réduits
                aléatoires pour achat rapide)
                <IconButton
                  color="info"
                  onClick={() => {
                    setTitle(
                      "définir l'ordre d'affichage de la section réductions"
                    );
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
                  title={"Obtenez plus pour moins cher !"}
                />
              ) : (
                <XGridSkeleton title={"Obtenez plus pour moins cher !"} />
              )}
              <br />
              <br />
              <hr />
              <br />
              <br />
              <p>
                composant de galerie (cela affichera les images sélectionnées
                avec chacune d&apos;elles contenant un titre qui s&apos;affiche
                au survol)
              </p>
              {loadingGallery ? (
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"50vh"}
                />
              ) : (
                <>
                  <div className={styles.imagesContainer}>
                    {galleryInfo.content.map((block) => {
                      return (
                        <div
                          key={block.image}
                          className={styles.imgPreview}
                          style={{
                            width: "90%",
                            border: "1px solid #ccc",
                            padding: "20px",
                            textAlign: "center",
                            textTransform: "capitalize",
                          }}
                        >
                          <span className={styles.closeIcon}>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setGalleryItem(block);
                                setTitle("supprimer l'élément");
                                setAction("DELETE-GALLERY-FORM");
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </span>
                          <img
                            src={`/api/images/${block.image.split("/").pop()}`}
                            onError={(e) => {
                              e.target.src = "/images/image-placeholder.jpg";
                            }}
                          />
                          {block.text?.length ? (
                            <p>text: {block.text}</p>
                          ) : null}
                          {block.link.length ? <p>lien personnalisé</p> : null}
                          {block.category.length ? (
                            <p>catégorie: {block.category}</p>
                          ) : null}
                        </div>
                      );
                    })}
                    {galleryInfo?.content?.length < 4 ? (
                      <IconButton
                        color="success"
                        onClick={() => {
                          setTitle("Ajouter un élément de galerie");
                          setAction("ADD-GALLERY-FROM");
                        }}
                        sx={{
                          width: "45px",
                          height: "45px",
                          margin: "30px",
                        }}
                      >
                        <label
                          style={{
                            cursor: "pointer",
                            width: "25px",
                            height: "25px",
                          }}
                        >
                          <AddIcon></AddIcon>
                        </label>
                      </IconButton>
                    ) : null}
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <p>Aperçu</p>
                  <XGallery
                    shopName={shopInfo.name}
                    content={galleryInfo.content}
                  />
                </>
              )}

              <br />
              <br />
              <hr />
              <br />
              <br />
              <h1>Informations de livraison</h1>
              <p>
                remplissez vos frais de livraison
                <IconButton
                  color="info"
                  onClick={() => saveArchitecture("shippingFee")}
                >
                  <CheckCircleIcon />
                </IconButton>{" "}
              </p>
              <div className="labeledInput">
                <label>Frais de livraison :</label>
                <input
                  type="number"
                  name="shippingFee"
                  placeholder="Frais en DT"
                  value={shopInfo.shippingFee}
                  onChange={(e) => {
                    setShopInfo({
                      ...shopInfo,
                      shippingFee: e.target.value,
                    });
                  }}
                  className="defaultInput"
                  style={{ width: "300px" }}
                />
              </div>
              <div className="labeledInput">
                <label>Livraison gratuite à partir de :</label>
              </div>
              <input
                type="number"
                name="freeShipping"
                placeholder="somme de commandes en DT"
                value={shopInfo.freeShipping}
                onChange={(e) => {
                  setShopInfo({
                    ...shopInfo,
                    freeShipping: e.target.value,
                  });
                }}
                className="defaultInput"
                style={{ width: "300px" }}
              />
              <br />
              <br />
              <hr />
              <br />
              <br />
              <h1>Informations de contact</h1>
              <p>
                remplissez vos coordonnées
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
                  placeholder="adresse"
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
                  placeholder="téléphone"
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
              <br />
              <hr />
              <br />
              <br />
              <h1>À propos de votre shop</h1>
              <p>
                qui êtes-vous et que vendez-vous ?
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
                placeholder="je suis une entreprise et je vends des trucs géniaux"
                value={architecture.about}
                onChange={(e) => {
                  setArchitecture({ ...architecture, about: e.target.value });
                }}
                className="defaultInput"
                style={{ maxWidth: "500px", height: "100px" }}
              />
            </div>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Architecture;
