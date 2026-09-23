import { CircularProgress, Skeleton } from "@mui/material";
import axios from "axios";
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
import XAutoComplete from "../../components/ui-components/XAutoComplete";
import XGallery from "../../components/ui-components/XGallery";
import XModal from "../../components/ui-components/XModal";
import archStyles from "../../styles/admin/Architecture.module.scss";
import styles from "../../styles/admin/Dashboard.module.scss";
import {
  compressImage,
  getThumbnail,
  isBase64,
} from "../../utils/config/convertHelper";
import { checkExpirity } from "../../utils/shared/checkExpirity";
import { getError } from "../../utils/shared/getError";
import { uploadImages } from "../../utils/shared/uploadImages";
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
import XGridSkeleton from "./../../components/ui-components/XGridSkeleton";

const TABS = [
  { id: "branding", label: "Branding & shipping" },
  { id: "home", label: "Home page" },
  { id: "contact", label: "Contact & about" },
];

function Architecture(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const currencies = [
    { name: "AED" },
    { name: "AFN" },
    { name: "ALL" },
    { name: "AMD" },
    { name: "ANG" },
    { name: "AOA" },
    { name: "ARS" },
    { name: "AUD" },
    { name: "AWG" },
    { name: "AZN" },
    { name: "BAM" },
    { name: "BBD" },
    { name: "BDT" },
    { name: "BGN" },
    { name: "BHD" },
    { name: "BIF" },
    { name: "BMD" },
    { name: "BND" },
    { name: "BOB" },
    { name: "BRL" },
    { name: "BSD" },
    { name: "BTN" },
    { name: "BWP" },
    { name: "BYN" },
    { name: "BZD" },
    { name: "CAD" },
    { name: "CDF" },
    { name: "CHF" },
    { name: "CLP" },
    { name: "CNY" },
    { name: "COP" },
    { name: "CRC" },
    { name: "CUP" },
    { name: "CVE" },
    { name: "CZK" },
    { name: "DJF" },
    { name: "DKK" },
    { name: "DOP" },
    { name: "DZD" },
    { name: "EGP" },
    { name: "ERN" },
    { name: "ETB" },
    { name: "EUR" },
    { name: "FJD" },
    { name: "FKP" },
    { name: "FOK" },
    { name: "GBP" },
    { name: "GEL" },
    { name: "GGP" },
    { name: "GHS" },
    { name: "GIP" },
    { name: "GMD" },
    { name: "GNF" },
    { name: "GTQ" },
    { name: "GYD" },
    { name: "HKD" },
    { name: "HNL" },
    { name: "HRK" },
    { name: "HTG" },
    { name: "HUF" },
    { name: "IDR" },
    { name: "ILS" },
    { name: "IMP" },
    { name: "INR" },
    { name: "IQD" },
    { name: "IRR" },
    { name: "ISK" },
    { name: "JEP" },
    { name: "JMD" },
    { name: "JOD" },
    { name: "JPY" },
    { name: "KES" },
    { name: "KGS" },
    { name: "KHR" },
    { name: "KID" },
    { name: "KMF" },
    { name: "KRW" },
    { name: "KWD" },
    { name: "KYD" },
    { name: "KZT" },
    { name: "LAK" },
    { name: "LBP" },
    { name: "LKR" },
    { name: "LRD" },
    { name: "LSL" },
    { name: "LYD" },
    { name: "MAD" },
    { name: "MDL" },
    { name: "MGA" },
    { name: "MKD" },
    { name: "MMK" },
    { name: "MNT" },
    { name: "MOP" },
    { name: "MRU" },
    { name: "MUR" },
    { name: "MVR" },
    { name: "MWK" },
    { name: "MXN" },
    { name: "MYR" },
    { name: "MZN" },
    { name: "NAD" },
    { name: "NGN" },
    { name: "NIO" },
    { name: "NOK" },
    { name: "NPR" },
    { name: "NZD" },
    { name: "OMR" },
    { name: "PAB" },
    { name: "PEN" },
    { name: "PGK" },
    { name: "PHP" },
    { name: "PKR" },
    { name: "PLN" },
    { name: "PYG" },
    { name: "QAR" },
    { name: "RON" },
    { name: "RSD" },
    { name: "RUB" },
    { name: "RWF" },
    { name: "SAR" },
    { name: "SBD" },
    { name: "SCR" },
    { name: "SDG" },
    { name: "SEK" },
    { name: "SGD" },
    { name: "SHP" },
    { name: "SLE" },
    { name: "SLL" },
    { name: "SOS" },
    { name: "SRD" },
    { name: "SSP" },
    { name: "STN" },
    { name: "SYP" },
    { name: "SZL" },
    { name: "THB" },
    { name: "TJS" },
    { name: "TMT" },
    { name: "TND" },
    { name: "TOP" },
    { name: "TRY" },
    { name: "TTD" },
    { name: "TVD" },
    { name: "TWD" },
    { name: "TZS" },
    { name: "UAH" },
    { name: "UGX" },
    { name: "USD" },
    { name: "UYU" },
    { name: "UZS" },
    { name: "VED" },
    { name: "VES" },
    { name: "VND" },
    { name: "VUV" },
    { name: "WST" },
    { name: "XAF" },
    { name: "XCD" },
    { name: "XDR" },
    { name: "XOF" },
    { name: "XPF" },
    { name: "YER" },
    { name: "ZAR" },
    { name: "ZMW" },
    { name: "ZWL" },
  ];

  const [loading, setLoading] = useState(true);
  const [loadingSlider, setLoadingSlider] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [compressingLogo, setCompressingLogo] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
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
  const [currency, setCurrency] = useState("");
  const [logo, setLogo] = useState(null);
  const [compressedLogo, setCompressedLogo] = useState(null);

  const [action, setAction] = useState("");
  const [title, setTitle] = useState("");
  const [activeTab, setActiveTab] = useState("branding");

  useEffect(() => {
    getShopInfo();
    getCategories();
    getDiscounts();
  }, []);

  const getShopInfo = async (load = true) => {
    load && setLoading(true);
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: userInfo.shop.name,
        getHomeInfo: true,
      });
      setShopInfo(data);
      setLogo(data.logo);
      setArchitecture(data.architecture);
      setCurrency(data.currency);
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
      dispatch({
        type: "USER_LOGIN",
        payload: {
          ...userInfo,
          shop: data.shopInfo,
        },
      });
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
      setAction("");
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const updateCurrency = async (currency) => {
    try {
      const { data } = await axios.post("/api/admin/shop/update-currency", {
        shopId: shopInfo._id,
        currency: currency,
      });
      dispatch({
        type: "USER_LOGIN",
        payload: {
          ...userInfo,
          shop: {
            ...shopInfo,
            currency: currency,
          },
        },
      });
      enqueueSnackbar(data.message, { variant: "success" });
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const toggleComponentVisibility = async (componentName) => {
    try {
      const { data } = await axios.post(
        "/api/admin/shop/toggle-component-visibility",
        {
          shopId: userInfo.shop._id,
          componentName: componentName,
        }
      );

      dispatch({
        type: "USER_LOGIN",
        payload: {
          ...userInfo,
          shop: data.shopInfo,
        },
      });
      await getShopInfo(false);

      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const updateLogo = async () => {
    setUploadingLogo(true);
    try {
      const data = await uploadImages([compressedLogo]);
      const result = await axios.post("/api/admin/shop/update-logo", {
        shopId: shopInfo._id,
        logo: "/uploads/" + data[0].filename,
      });
      dispatch({
        type: "USER_LOGIN",
        payload: {
          ...userInfo,
          shop: { ...userInfo.shop, logo: "/uploads/" + data[0].filename },
        },
      });
      setCompressedLogo(null);
      enqueueSnackbar(result.data.message, { variant: "success" });
      setUploadingLogo(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      setUploadingLogo(false);
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
      setSlideImageLoading(true);
      try {
        const data = await uploadImages([slideImage]);
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
      enqueueSnackbar("the slide image is required", {
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
      setGalleryItemImageLoading(true);
      try {
        const data = await uploadImages([galleryItemImage]);
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
      enqueueSnackbar("the gallery item image is required", {
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
                  : "/images/image-placeholder.jpg";
              }}
            />
          ) : null}
          <label className="btn btn-sm" style={{ marginBottom: "20px" }} htmlFor="slide">{slide.image.length ? "Change image" : "Add image"}</label>
          <p>
            category link:{" "}
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
                Select a category (if you have a custom link,
                it will replace this one)
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
      <p>are you sure you want to delete this slide?</p>
    </div>
  );

  const categoriesGridForm = (
    <form>
      <p>
        visible index : (this will determine the display order of this
        section on your home page)
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
                <button
                  type="button"
                  className={`btn btn-sm ${
                    architecture?.home?.categoriesComponent?.selectedCategoriesIds?.includes(
                          category._id
                        ) ? "btn-primary" : ""
                  }`}
                  onClick={(e) => {
                      updateCategoriesGrid(
                        e,
                        "selectedCategoriesIds",
                        category._id
                      );
                    }}
                >
                  {architecture?.home?.categoriesComponent?.selectedCategoriesIds?.includes(
                          category._id
                        ) ? "Selected" : "Select"}
                </button>
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
        visible index : (this will determine the display order of this
        section on your home page)
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

  const galleryOrderForm = (
    <form>
      <p>
        visible index : (this will determine the display order of this
        section on your home page)
        <input
          type="number"
          min={0}
          className="defaultInput"
          value={galleryInfo?.visibleIndex}
          onChange={(e) => {
            setGalleryInfo({
              ...galleryInfo,
              visibleIndex: e.target.value,
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
          <label className="btn btn-sm" style={{ marginBottom: "20px" }} htmlFor="item">{galleryItem.image.length ? "Change image" : "Add image"}</label>
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
            category link:{" "}
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
                Select a category (if you have a custom link,
                it will replace this one)
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
            custom link:
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
      <p>do you want to delete this gallery item?</p>
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
              : action === "CATEGORIES-GRID-FORM"
              ? () => saveArchitecture("categoriesComponent")
              : action === "DISCOUNT-FORM"
              ? () => saveArchitecture("discountComponent")
              : action === "GALLERY-ORDER-FORM"
              ? () => saveArchitecture("galleryComponent")
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
                action === "DELETE-GALLERY-FORM" ||
                action === "GALLERY-ORDER-FORM"
              ? ModalSizes.SMALL
              : null
          }
        >
          <div className={styles.modal}>
            {action === "ADD-SLIDE-FROM"
              ? addSliderForm
              : action === "DELETE-SLIDE-FORM"
              ? deleteSlideForm
              : action === "GALLERY-ORDER-FORM"
              ? galleryOrderForm
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
          <div className={styles.controls}>
            <h1>Configure your shop your way</h1>
          </div>
          <p className={archStyles.pageHint}>
            Changes are saved per section — use each section&apos;s Save
            button (or the modal&apos;s Confirm) once you&apos;re happy with
            it.
          </p>
          {loading && !architecture.home ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 200px)"}
            />
          ) : (
            <>
              <div className={archStyles.tabBar} role="tablist">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`${archStyles.tabButton} ${
                      activeTab === tab.id ? archStyles.tabActive : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "branding" && (
                <div className={archStyles.tabPanel}>
                  <div className={archStyles.sectionCard}>
                    <h2>Logo</h2>
                    <div className="row" style={{ justifyContent: "flex-start" }}>
                      <>
                        {!compressingLogo ? (
                          <>
                            {logo ? (
                              <img
                                alt="logo"
                                src={
                                  logo.startsWith("data:") ||
                                  logo.startsWith("/cyber-mall")
                                    ? logo
                                    : `/api/images/${logo.split("/").pop()}`
                                }
                                onError={(e) => {
                                  setLogo("/cyber-mall.png");
                                }}
                                width={"150"}
                                height={"80"}
                                style={{ objectFit: "contain" }}
                              />
                            ) : (
                              <img
                                alt="logo"
                                src={"/cyber-mall.png"}
                                width={"150"}
                                height={"80"}
                                style={{ objectFit: "contain" }}
                              />
                            )}
                          </>
                        ) : (
                          <Skeleton
                            variant="circular"
                            width={"80px"}
                            height={"80px"}
                          />
                        )}
                      </>
                      <input
                        id="logo"
                        hidden
                        type="file"
                        accept="image/*"
                        name="logo"
                        onChange={async (e) => {
                          setCompressingLogo(true);
                          const base64 = await getThumbnail(e.target.files[0]);
                          const compressed = await compressImage(
                            e.target.files[0],
                            "png",
                            198
                          );
                          setLogo(base64);
                          setCompressedLogo(compressed);
                          setCompressingLogo(false);
                        }}
                      />
                      <div className={`btn-group ${archStyles.inlineActions}`}>
                        {compressingLogo ? (
                          <span className="btn btn-sm">
                            <CircularProgress size={16} />
                          </span>
                        ) : (
                          <label className="btn btn-sm" htmlFor="logo">
                            Change logo
                          </label>
                        )}
                        {uploadingLogo ? (
                          <span className="btn btn-sm">
                            <CircularProgress size={16} />
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            disabled={!compressedLogo}
                            onClick={updateLogo}
                          >
                            Save logo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={archStyles.sectionCard}>
                    <h2>Shop currency</h2>
                    <div className="row" style={{ width: "150px", justifyContent: "flex-start" }}>
                      <XAutoComplete
                        options={currencies}
                        value={currency}
                        optionDisplayExpr="name"
                        optionValueExpr="name"
                        onChange={(e, value) => {
                          setCurrency(value?.name ?? "");
                          updateCurrency(value?.name ?? "");
                        }}
                        placeholder="currency"
                      />
                    </div>
                  </div>

                  <div className={archStyles.sectionCard}>
                    <div className={archStyles.sectionHeader}>
                      <h2>Shipping</h2>
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => saveArchitecture("shippingFee")}
                      >
                        Save
                      </button>
                    </div>
                    <div className={archStyles.shippingGrid}>
                      <div className="labeledInput">
                        <label>Shipping fee</label>
                        <div className={archStyles.suffixInput}>
                          <input
                            type="number"
                            name="shippingFee"
                            placeholder={`0.0 ${shopInfo.currency}`}
                            value={shopInfo.shippingFee}
                            onChange={(e) => {
                              setShopInfo({
                                ...shopInfo,
                                shippingFee: e.target.value,
                              });
                            }}
                            className="defaultInput"
                          />
                          <span>{shopInfo.currency}</span>
                        </div>
                      </div>
                      <div className="labeledInput">
                        <label>Free shipping starting from</label>
                        <div className={archStyles.suffixInput}>
                          <input
                            type="number"
                            name="freeShipping"
                            placeholder={`0.0 ${shopInfo.currency}`}
                            value={shopInfo.freeShipping}
                            onChange={(e) => {
                              setShopInfo({
                                ...shopInfo,
                                freeShipping: e.target.value,
                              });
                            }}
                            className="defaultInput"
                          />
                          <span>{shopInfo.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "home" && (
                <div className={archStyles.tabPanel}>
                  <div className={archStyles.sectionCard}>
                    <h2>Slider</h2>
                    <p className={archStyles.sectionHint}>
                      The images must have the same resolution for optimal
                      display (recommended: 1500 x 600).
                    </p>
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
                                className={`${styles.imgPreview} ${archStyles.thumbCard}`}
                              >
                                <span className={styles.closeIcon}>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                      setSlide(slide);
                                      setTitle("delete the slide");
                                      setAction("DELETE-SLIDE-FORM");
                                    }}
                                  >
                                    Delete
                                  </button>
                                </span>
                                <img
                                  alt={slide.category}
                                  src={`/api/images/${slide.image.split("/").pop()}`}
                                  onError={(e) => {
                                    e.target.src = "/images/image-placeholder.jpg";
                                  }}
                                />
                                {slide.link?.length ? <p>custom link</p> : null}
                                {slide.category?.length ? (
                                  <p>category: {slide.category}</p>
                                ) : null}
                              </div>
                            );
                          })}
                          {sliderInfo?.length < 3 ||
                          userInfo?.shop.pack.type === "PREMIUM" ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setTitle("Add slide");
                                setAction("ADD-SLIDE-FROM");
                              }}
                            >
                              + Add slide
                            </button>
                          ) : null}
                        </div>
                        <p className={archStyles.previewLabel}>Preview</p>
                        <HomeSlider
                          disabled={true}
                          slides={
                            sliderInfo.length
                              ? sliderInfo
                              : [
                                  {
                                    link: "",
                                    image: "slider-placeholder.jpg",
                                  },
                                ]
                          }
                          shopInfo={shopInfo}
                        />
                      </>
                    )}
                  </div>

                  <div className={archStyles.sectionCard}>
                    <div className={archStyles.sectionHeader}>
                      <h2>Categories grid</h2>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => {
                            setTitle("select the categories to display in the grid");
                            setAction("CATEGORIES-GRID-FORM");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={async () => {
                            await toggleComponentVisibility("categoriesComponent");
                          }}
                        >
                          {architecture.home.categoriesComponent.visible ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <p className={archStyles.sectionHint}>
                      Select which categories are featured in this section.
                    </p>
                    {categories.length ? (
                      <CategoriesGrid
                        disabled={true}
                        categories={categories}
                        architecture={architecture}
                        shopInfo={shopInfo}
                      />
                    ) : (
                      <XGridSkeleton title={"Discover Our Categories"} />
                    )}
                  </div>

                  <div className={archStyles.sectionCard}>
                    <div className={archStyles.sectionHeader}>
                      <h2>Discounts</h2>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => {
                            setTitle("set the display order of the discounts section");
                            setAction("DISCOUNT-FORM");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={async () => {
                            await toggleComponentVisibility("discountComponent");
                          }}
                        >
                          {architecture.home.discountComponent.visible ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <p className={archStyles.sectionHint}>
                      Displays random discounted products for quick purchase.
                    </p>
                    {discounts.length ? (
                      <ProductsSlider
                        disabled={true}
                        products={discounts}
                        shopInfo={shopInfo}
                        title={"Get more for less!"}
                      />
                    ) : (
                      <XGridSkeleton title={"Get more for less!"} />
                    )}
                  </div>

                  <div className={archStyles.sectionCard}>
                    <div className={archStyles.sectionHeader}>
                      <h2>Gallery</h2>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => {
                            setTitle("set the display order of the gallery section");
                            setAction("GALLERY-ORDER-FORM");
                          }}
                        >
                          Display order
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={async () => {
                            await toggleComponentVisibility("galleryComponent");
                          }}
                        >
                          {galleryInfo.visible ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <p className={archStyles.sectionHint}>
                      Displays the selected images, each with a title shown on
                      hover.
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
                                className={`${styles.imgPreview} ${archStyles.thumbCard}`}
                              >
                                <span className={styles.closeIcon}>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                      setGalleryItem(block);
                                      setTitle("delete the item");
                                      setAction("DELETE-GALLERY-FORM");
                                    }}
                                  >
                                    Delete
                                  </button>
                                </span>
                                <img
                                  alt={block.category}
                                  src={`/api/images/${block.image.split("/").pop()}`}
                                  onError={(e) => {
                                    e.target.src = "/images/image-placeholder.jpg";
                                  }}
                                />
                                {block.text?.length ? <p>text: {block.text}</p> : null}
                                {block.link?.length ? <p>custom link</p> : null}
                                {block.category?.length ? (
                                  <p>category: {block.category}</p>
                                ) : null}
                              </div>
                            );
                          })}
                          {galleryInfo?.content?.length < 4 ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setTitle("Add a gallery item");
                                setAction("ADD-GALLERY-FROM");
                              }}
                            >
                              + Add item
                            </button>
                          ) : null}
                        </div>
                        <p className={archStyles.previewLabel}>Preview</p>
                        <XGallery
                          disabled={true}
                          shopInfo={shopInfo}
                          content={galleryInfo.content}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className={archStyles.tabPanel}>
                  <div className={archStyles.sectionCard}>
                    <div className={archStyles.sectionHeader}>
                      <h2>Contact information</h2>
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => saveArchitecture("contactComponent")}
                      >
                        Save
                      </button>
                    </div>
                    <div className={archStyles.contactGrid}>
                      <div className={archStyles.iconInput}>
                        <AddressIcon />
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
                        />
                      </div>
                      <div className={archStyles.iconInput}>
                        <MailIcon />
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
                        />
                      </div>
                      <div className={archStyles.iconInput}>
                        <PhoneEnabledIcon />
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
                        />
                      </div>
                      <div className={archStyles.iconInput}>
                        <FacebookIcon />
                        <input
                          name="facebook"
                          placeholder="facebook"
                          value={architecture.contact.socials.facebook}
                          onChange={onSocialsChange}
                          className="defaultInput"
                        />
                      </div>
                      <div className={archStyles.iconInput}>
                        <InstagramIcon />
                        <input
                          name="instagram"
                          placeholder="instagram"
                          value={architecture.contact.socials.instagram}
                          onChange={onSocialsChange}
                          className="defaultInput"
                        />
                      </div>
                      <div className={archStyles.iconInput}>
                        <TiktokIcon />
                        <input
                          name="tiktok"
                          placeholder="tiktok"
                          value={architecture.contact.socials.tiktok}
                          onChange={onSocialsChange}
                          className="defaultInput"
                        />
                      </div>
                      <div className={archStyles.iconInput}>
                        <YouTubeIcon />
                        <input
                          name="youtube"
                          placeholder="youtube"
                          value={architecture.contact.socials.youtube}
                          onChange={onSocialsChange}
                          className="defaultInput"
                        />
                      </div>
                      <div className={archStyles.iconInput}>
                        <LinkedInIcon />
                        <input
                          name="linkedIn"
                          placeholder="linkedIn"
                          value={architecture.contact.socials.linkedIn}
                          onChange={onSocialsChange}
                          className="defaultInput"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={archStyles.sectionCard}>
                    <div className={archStyles.sectionHeader}>
                      <h2>About your shop</h2>
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => saveArchitecture("aboutComponent")}
                      >
                        Save
                      </button>
                    </div>
                    <p className={archStyles.sectionHint}>
                      Who are you and what do you sell?
                    </p>
                    <textarea
                      rows={5}
                      name="about"
                      placeholder="I am a company and I sell awesome things"
                      value={architecture.about}
                      onChange={(e) => {
                        setArchitecture({ ...architecture, about: e.target.value });
                      }}
                      className="defaultInput"
                      style={{ maxWidth: "500px", height: "100px" }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Architecture;
