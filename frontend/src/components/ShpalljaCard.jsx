import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import "../index.css";
import { useNavigate } from "react-router-dom";
import Perdoruesi from "../PerdoruesiContext";
import { useState, useEffect } from "react";
import axios from "axios";

function ShpalljaCard({ shpallja }) {
  const navigate = useNavigate();
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();
  const [eshteRuajtur, setEshteRuajtur] = useState(false);
  const [duke_ngarkuar, setDuke_ngarkuar] = useState(false);
  const [fotoError, setFotoError] = useState(false);

  useEffect(() => {
    const kontrolloStatusin = async () => {
      if (perdoruesiData && perdoruesiData.tipiPerdoruesit !== "punedhenes") {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/punetRuajtura/eshte-ruajtur/${shpallja._id}`,
          );
          setEshteRuajtur(response.data.eshteRuajtur);
        } catch (error) {
          console.error("Gabim gjatë kontrollimit:", error);
        }
      }
    };

    kontrolloStatusin();
  }, [shpallja._id, perdoruesiData]);

  const handleClick = () => {
    navigate(`/shpallja/${shpallja._id}`);
  };

  const ndryshoRuajtjen = async (e) => {
    e.stopPropagation();

    if (!perdoruesiData) {
      alert("Ju lutem kyçuni për të ruajtur punë");
      return;
    }

    if (perdoruesiData.tipiPerdoruesit === "punedhenes") {
      return;
    }

    setDuke_ngarkuar(true);
    try {
      if (eshteRuajtur) {
        const response = await axios.delete(
          `http://localhost:3000/api/punetRuajtura/hiq/${shpallja._id}`,
          {
            data: { perdoruesiId: perdoruesiData._id },
          },
        );

        if (response.data.success) {
          setEshteRuajtur(false);
        }
      } else {
        const response = await axios.post(
          `http://localhost:3000/api/punetRuajtura/ruaj/${shpallja._id}`,
          {
            perdoruesiId: perdoruesiData._id,
          },
        );

        if (response.data.success) {
          setEshteRuajtur(true);
        }
      }
    } catch (error) {
      console.error("Gabim gjatë ndryshimit të ruajtjes:", error);
      alert("Gabim gjatë ruajtjes së punës");
    } finally {
      setDuke_ngarkuar(false);
    }
  };

  const handlePhotoError = () => {
    setFotoError(true);
  };

  const isPhotoUrl =
    shpallja.fotoProfili && shpallja.fotoProfili.startsWith("http");
  const isPhotoBase64 =
    shpallja.fotoProfili && shpallja.fotoProfili.startsWith("data:");

  // Extract company name from email (before @)
  const getCompanyName = () => {
    if (!shpallja.emailKompanise) return "COMPANY";
    const name = shpallja.emailKompanise.split("@")[0];
    return name.toUpperCase();
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg w-full p-6 transition-colors duration-200">
      {/* Header with Logo, Company Name, and Bookmark */}
      <div className="flex items-start gap-3 mb-2">
        {/* Company Logo */}
        <div className="shrink-o">
          {(isPhotoUrl || isPhotoBase64) && !fotoError ? (
            <img
              src={shpallja.fotoProfili}
              alt="Company Logo"
              className="w-14 h-14 rounded-lg object-cover border border-gray-200"
              onError={handlePhotoError}
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center border border-gray-200">
              <span className="text-white font-bold text-lg">
                {getCompanyName().substring(0, 2)}
              </span>
            </div>
          )}
        </div>

        {/* Company Name and Title */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {getCompanyName()}
          </p>
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-0">
            {shpallja.pozitaPunes}
          </h3>
        </div>

        {/* Bookmark Button */}
        {perdoruesiData?.tipiPerdoruesit !== "punedhenes" && (
          <button
            onClick={ndryshoRuajtjen}
            disabled={duke_ngarkuar}
            className={`flex shrink-0 transition-all duration-200 ${
              duke_ngarkuar
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110 cursor-pointer"
            }`}
          >
            <FontAwesomeIcon
              icon={eshteRuajtur ? faBookmarkSolid : faBookmarkRegular}
              className={`text-l ${eshteRuajtur ? "text-primary" : "text-gray-400"}`}
            />
          </button>
        )}
      </div>

      {/* Job Details */}
      <div className="mb-2 h-10 overflow-hidden">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
          {shpallja.pershkrimiPunes
            ? shpallja.pershkrimiPunes.substring(0, 100) +
              (shpallja.pershkrimiPunes.length > 100 ? "..." : "")
            : "No description available"}
        </p>
      </div>

      {/* HR Line */}
      <hr className="hrCard" />

      {/* Footer - Tags and Location */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
          <FontAwesomeIcon icon={faLocationDot} className="text-gray-500" />
          {shpallja.lokacioniPunes || "Remote"}
        </span>

        {shpallja.niveliPunes && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {shpallja.niveliPunes}
          </span>
        )}

        {shpallja.orari && shpallja.orari.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {shpallja.orari[0]}
          </span>
        )}
      </div>

      {/* Apply Button */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          {shpallja.pagaPrej > 0 && shpallja.pagaDeri > 0 && (
            <p className="text-sm font-medium text-gray-900">
              <FontAwesomeIcon
                icon={faDollarSign}
                className="mr-1 text-gray-500"
              />
              {shpallja.pagaPrej}-{shpallja.pagaDeri}
            </p>
          )}
        </div>

        <button
          className="relative group bg-transparent cursor-pointer"
          onClick={handleClick}
        >
          <div
            className={`${perdoruesiData?.tipiPerdoruesit === "punedhenes" ? "hidden" : "block"}`}
          >
            <span className="relative z-10 bg-linear-to-r from-slate-700 via-gray-800 to-black bg-clip-text text-transparent font-semibold text-sm group-hover:from-slate-800 group-hover:via-gray-900 group-hover:to-black transition-all duration-300">
              Apliko tani
            </span>
            <FontAwesomeIcon
              icon={faArrowRightLong}
              className="ml-1 text-gray-700 group-hover:text-black group-hover:translate-x-1 transition-all duration-300"
            />
          </div>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-slate-700 to-black group-hover:w-full transition-all duration-500 ease-out"></div>
        </button>
      </div>
    </div>
  );
}

export default ShpalljaCard;
