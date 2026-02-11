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
        // Ruaj shpalljen
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

  return (
    <div className="border border-gray-200 hover:bg-gray-200 shadow-xl rounded-xl w-full p-3">
      <div className="flex justify-between">
        <FontAwesomeIcon icon={faUser} className="text-3xl" />
        {perdoruesiData?.tipiPerdoruesit !== "punedhenes" && (
          <button
            onClick={ndryshoRuajtjen}
            disabled={duke_ngarkuar}
            className={`transition-all duration-200 ${
              duke_ngarkuar
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110 cursor-pointer"
            }`}
          >
            <FontAwesomeIcon
              icon={eshteRuajtur ? faBookmarkSolid : faBookmarkRegular}
              className={`text-xl ${eshteRuajtur ? "text-primary" : "text-gray-600"}`}
            />
          </button>
        )}
      </div>
      <p className="grid mt-6 font-semibold ">{shpallja.pozitaPunes}</p>
      <div className="flex gap-5 mt-2">
        <p className="paragraf font-light">
          {" "}
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          {shpallja.orari}
          {shpallja.status}
        </p>
        <p className="paragraf font-light">{shpallja.niveliPunes}</p>
      </div>
      <hr className="hrCard" />
      <div className="flex items-center justify-between">
        <div>
          <p className="paragraf font-medium">
            <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
            {shpallja.pagaPrej}-{shpallja.pagaDeri}
          </p>
          <p className="paragraf text-sm font-medium mt-1">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="mr-1 text-gray-600"
            />
            {shpallja.lokacioniPunes}
          </p>
        </div>
        <button
          className="relative group bg-transparent cursor-pointer"
          onClick={handleClick}
        >
          <div
            className={`${perdoruesiData?.tipiPerdoruesit === "punedhenes" ? "hidden" : "block"}`}
          >
            <span className="relative z-10 bg-linear-to-r from-slate-700 via-gray-800 to-black bg-clip-text text-transparent font-semibold text-l group-hover:from-slate-800 group-hover:via-gray-900 group-hover:to-black transition-all duration-300">
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
