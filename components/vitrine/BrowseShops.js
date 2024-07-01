import { LinearProgress } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { ActivityDomains } from "../../utils/shared/activityDomains";
import { getError } from "../../utils/shared/getError";
import XAutoComplete from "../ui-components/XAutoComplete";
import XPagination from "../ui-components/XPagination";

function BrowseShops(props) {
  const { enqueueSnackbar } = useSnackbar();

  const [activityDomain, setActivityDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [shops, setShops] = useState([]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/get-vitrine-shops", {
        activityDomain: activityDomain,
        page: page + 1,
      });
      setShops(data.shops);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  useEffect(() => {
    fetchShops();
  }, [activityDomain, page]);

  const getSvgBackground = (startColor, endColor) => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:#ffffff;display:block;z-index:1;position:relative" width="1300" height="1300" preserveAspectRatio="xMidYMid" viewBox="0 0 1300 1300">
    <g transform="translate(715.5,265.5) scale(1,1) translate(-715.5,-265.5)">
        <linearGradient id="lg-0.03151281907599124" x1="0" x2="1" y1="0" y2="0">
            <stop stop-color="${startColor}" offset="0"></stop>
            <stop stop-color="${endColor}" offset="1"></stop>
        </linearGradient>
        <path d="" fill="url(#lg-0.03151281907599124)" opacity="0.4">
            <animate attributeName="d" dur="10s" repeatCount="indefinite" keyTimes="0;0.333;0.667;1" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="0s" values="M0 0L 0 412.8034240766403Q 178.875 279.93442514212285  357.75 260.71402222055406T 715.5 310.90686234221056T 1073.25 228.2275910530334T 1300 133.15860081242752L 1300 0 Z;M0 0L 0 306.4252385967986Q 178.875 455.42256267304447  357.75 415.04098014283363T 715.5 367.20118696341956T 1073.25 253.23600778996547T 1300 174.2389451606512L 1300 0 Z;M0 0L 0 404.4385515415611Q 178.875 311.7645806261356  357.75 288.59047114209625T 715.5 295.87172843471774T 1073.25 170.04618047692045T 1300 312.474521166645L 1300 0 Z;M0 0L 0 412.8034240766403Q 178.875 279.93442514212285  357.75 260.71402222055406T 715.5 310.90686234221056T 1073.25 228.2275910530334T 1300 133.15860081242752L 1300 0 Z"></animate>
        </path>
        <path d="" fill="url(#lg-0.03151281907599124)" opacity="0.4">
            <animate attributeName="d" dur="10s" repeatCount="indefinite" keyTimes="0;0.333;0.667;1" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-5s" values="M0 0L 0 285.6919007117341Q 178.875 375.96024861093053  357.75 334.58389843401824T 715.5 214.83616116210857T 1073.25 178.31507228740315T 1300 224.3538186979241L 1300 0 Z;M0 0L 0 382.53986712125675Q 178.875 281.2983117319439  357.75 242.26533709084876T 715.5 244.46262539301443T 1073.25 271.1813828703455T 1300 284.4988844640094L 1300 0 Z;M0 0L 0 391.652113009791647Q 178.875 430.055685865642  357.75 411.1194881813352T 715.5 304.09283280948483T 1073.25 159.23450629919603T 1300 233.46500324995478L 1300 0 Z;M0 0L 0 285.6919007117341Q 178.875 375.96024861093053  357.75 334.58389843401824T 715.5 214.83616116210857T 1073.25 178.31507228740315T 1300 224.3538186979241L 1300 0 Z"></animate>
        </path>
    </g>
</svg>`;

    const encodedSvg = encodeURIComponent(svgString);
    return `url("data:image/svg+xml,${encodedSvg}")`;
  };
  return (
    <section className="vitrine-block">
      <p data-aos="fade-up">
        Veux-tu faire du shopping? Va faire un tour dans nos shops.
      </p>
      <div className="row" data-aos="fade-up" data-aos-delay="200">
        <XAutoComplete
          options={ActivityDomains}
          value={activityDomain}
          optionDisplayExpr="name"
          optionValueExpr="name"
          onChange={(e, value) => {
            setActivityDomain(value?.name ?? "");
          }}
          required={true}
          placeholder="domaine d'activité"
        />
      </div>
      <br />
      {loading ? (
        <LinearProgress color="black" />
      ) : (
        <>
          {shops.length ? (
            <>
              <div className="grid-4">
                {shops.map((shop) => {
                  return (
                    <Link
                      href={
                        shop.domainName.length
                          ? `https://${shop.domainName}`
                          : `/${shop.name}`
                      }
                      rel="noreferrer"
                      target="_blank"
                      className="vitine-card"
                      key={shop._id}
                      style={{
                        boxShadow: `0px 0px 5px #0e0e0e`,
                        backgroundImage: getSvgBackground(
                          shop.settings.headerColor,
                          shop.settings.footerColor
                        ),
                      }}
                    >
                      {shop.logo ? (
                        <img
                          alt={shop.name}
                          src={`/api/images/${shop.logo.split("/").pop()}`}
                          onError={(e) => {
                            e.target.src = "/images/image-placeholder.jpg";
                          }}
                        />
                      ) : null}
                      <p>{shop.name}</p>
                    </Link>
                  );
                })}
              </div>
              <XPagination
                count={count}
                page={page}
                onChange={(e, page) => {
                  setPage(page - 1);
                }}
              />
            </>
          ) : activityDomain.length ? (
            <p>
              Aucun résultat n&apos;a été trouvé pour ce domaine
              d&apos;activité.
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

export default BrowseShops;
