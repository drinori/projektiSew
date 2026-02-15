import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import {
  faDollarSign,
  faLocationDot,
  faClock,
  faBriefcase,
  faChevronLeft,
  faArrowRight,
  faUsers,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Perdoruesi from "../PerdoruesiContext";

function Shpallja() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shpallja, setShpallja] = useState(null);
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();
  const [eshteRuajtur, setEshteRuajtur] = useState(false);
  const [duke_ngarkuar, setDuke_ngarkuar] = useState(false);
  const [fotoError, setFotoError] = useState(false);
  const [kaAplikuar, setKaAplikuar] = useState(false);

  const handlePhotoError = () => setFotoError(true);

  const getCompanyName = () => {
    if (!shpallja?.emailKompanise) return "COMPANY";
    return shpallja.emailKompanise.split("@")[0].toUpperCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shpallja/${id}`,
        );
        setShpallja(response.data.data);
      } catch (error) {
        console.log("Error:", error);
        setShpallja(null);
      }
    };
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const kontrolloStatusin = async () => {
      if (
        perdoruesiData &&
        perdoruesiData.tipiPerdoruesit !== "punedhenes" &&
        id
      ) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/punetRuajtura/eshte-ruajtur/${id}`,
          );
          setEshteRuajtur(response.data.eshteRuajtur);
        } catch (error) {
          console.error("Gabim gjatë kontrollimit:", error);
        }
      }
    };
    kontrolloStatusin();
  }, [id, perdoruesiData]);

  useEffect(() => {
    const kontrolloAplikimin = async () => {
      if (
        !perdoruesiData ||
        perdoruesiData.tipiPerdoruesit === "punedhenes" ||
        !id
      ) {
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/shpallja/ka-aplikuar/${id}`,
          { withCredentials: true },
        );
        setKaAplikuar(response.data.kaAplikuar);
      } catch (error) {
        console.error("Gabim gjatë kontrollit të aplikimit:", error);
      }
    };

    kontrolloAplikimin();
  }, [id, perdoruesiData]);

  const ndryshoRuajtjen = async () => {
    if (!perdoruesiData) {
      alert("Ju lutem kyçuni për të ruajtur punë");
      return;
    }
    if (perdoruesiData.tipiPerdoruesit === "punedhenes") {
      alert("Punëdhënësit nuk mund të ruajnë punë");
      return;
    }
    setDuke_ngarkuar(true);
    try {
      if (eshteRuajtur) {
        const response = await axios.delete(
          `http://localhost:3000/api/punetRuajtura/hiq/${id}`,
          { data: { perdoruesiId: perdoruesiData._id } },
        );
        if (response.data.success) setEshteRuajtur(false);
      } else {
        const response = await axios.post(
          `http://localhost:3000/api/punetRuajtura/ruaj/${id}`,
          { perdoruesiId: perdoruesiData._id },
        );
        if (response.data.success) setEshteRuajtur(true);
      }
    } catch (error) {
      console.error("Gabim gjatë ndryshimit të ruajtjes:", error);
      alert("Gabim gjatë ruajtjes së punës");
    } finally {
      setDuke_ngarkuar(false);
    }
  };

  if (!shpallja) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">Diqka shkoi keq!</p>
        </div>
      </div>
    );
  }

  const aplikoTani = (e) => {
    e.preventDefault();

    if (!perdoruesiData) {
      navigate("/kycja");
      return;
    }

    const aftesiteAplikantit = (perdoruesiData.aftesite || []).map((aftesia) =>
      aftesia.toLowerCase().trim(),
    );
    const aftesiteDetyrueshme = shpallja.aftesitePrimare.map((aftesia) =>
      aftesia.toLowerCase().trim(),
    );

    const iGatshem = aftesiteDetyrueshme.every((aftesia) =>
      aftesiteAplikantit.includes(aftesia),
    );

    if (!iGatshem) {
      alert("Nuk i keni të gjitha aftësitë e kërkuara për këtë pozitë.");
      return;
    }

    navigate(`/${id}/aplikimi`);
  };

  const hasPhoto =
    (shpallja.fotoProfili?.startsWith("http") ||
      shpallja.fotoProfili?.startsWith("data:")) &&
    !fotoError;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F7FBFC] via-[#D6E6F2] to-[#B9D7EA]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="text-xs group-hover:-translate-x-0.5 transition-transform"
          />
          Kthehu tek punët
        </button>

        {/* ✅ FIXED: Two column layout – sidebar is a sibling, not nested */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── LEFT COLUMN: Job Details Card ── */}
          <div className="flex-1">
            <div className="bg-white/70 border border-[#F7FBFC] rounded-2xl shadow-lg overflow-hidden">
              {/* Job Header */}
              <div className="p-6 md:p-8 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  {/* Logo + Company + Title */}
                  <div className="flex items-start gap-4">
                    {hasPhoto ? (
                      <img
                        src={shpallja.fotoProfili}
                        alt="Company Logo"
                        className="w-16 h-16 rounded-xl object-cover border border-[#D6E6F2] shrink-0"
                        onError={handlePhotoError}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center border border-[#D6E6F2] shrink-0">
                        <span className="text-white font-bold text-xl">
                          {getCompanyName().substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                        {getCompanyName()}
                      </p>
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                        {shpallja.pozitaPunes}
                      </h1>
                    </div>
                  </div>

                  {/* Bookmark */}
                  {perdoruesiData?.tipiPerdoruesit !== "punedhenes" && (
                    <button
                      onClick={ndryshoRuajtjen}
                      disabled={duke_ngarkuar}
                      className={`self-start flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium bg-transparent hover:bg-gray-100 ${
                        eshteRuajtur
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      } ${
                        duke_ngarkuar
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          eshteRuajtur ? faBookmarkSolid : faBookmarkRegular
                        }
                      />
                      {eshteRuajtur ? "Ruajtur" : "Ruaj"}
                    </button>
                  )}
                </div>

                {/* Tag pills */}
                <div className="flex flex-wrap gap-2">
                  {shpallja.lokacioniPunes && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-gray-500"
                      />
                      {shpallja.lokacioniPunes}
                    </span>
                  )}
                  {shpallja.orari && shpallja.orari.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-gray-500"
                      />
                      {Array.isArray(shpallja.orari)
                        ? shpallja.orari[0]
                        : shpallja.orari}
                    </span>
                  )}
                  {shpallja.niveliPunes && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      <FontAwesomeIcon
                        icon={faLayerGroup}
                        className="text-gray-500"
                      />
                      {shpallja.niveliPunes}
                    </span>
                  )}
                  {shpallja.eksperienca && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      <FontAwesomeIcon
                        icon={faBriefcase}
                        className="text-gray-500"
                      />
                      {shpallja.eksperienca}
                    </span>
                  )}
                  {shpallja.pagaPrej > 0 && shpallja.pagaDeri > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="text-gray-500"
                      />
                      ${shpallja.pagaPrej} – ${shpallja.pagaDeri}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Sections – design from second version */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Job Description */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Përshkrimi i Punës
                  </h2>
                  {shpallja.pershkrimiPunes ? (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {shpallja.pershkrimiPunes}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic text-sm">
                      Nuk ka përshkrim të shtuar.
                    </p>
                  )}
                </div>

                {/* Required Skills – White Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
                    Aftësitë e Detyrueshme
                  </h2>
                  {shpallja.aftesitePrimare &&
                  shpallja.aftesitePrimare.length > 0 ? (
                    <ul className="space-y-3">
                      {shpallja.aftesitePrimare.map((kerkesa, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                          <span className="text-gray-600 leading-relaxed">
                            {kerkesa}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic text-sm">
                      Nuk ka aftësi të specifikuara.
                    </p>
                  )}
                </div>

                {/* Optional Skills – White Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
                    Aftësitë Opsionale
                  </h2>
                  {shpallja.aftesiteSekondare &&
                  shpallja.aftesiteSekondare.length > 0 ? (
                    <ul className="space-y-3">
                      {shpallja.aftesiteSekondare.map((kerkesa, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                          <span className="text-gray-600 leading-relaxed">
                            {kerkesa}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic text-sm">
                      Nuk ka aftësi të specifikuara.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Sidebar – SIBLING, NOT NESTED ✅ */}
          <div className="lg:w-80 space-y-4">
            {/* Apply Card – with the EXACT button from your second version */}
            <div className="bg-white/70 border border-[#F7FBFC] rounded-2xl shadow-lg p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Apliko tani
              </h3>

              {/* Job detail rows */}
              <div className="divide-y divide-gray-100">
                {shpallja.pagaPrej > 0 && shpallja.pagaDeri > 0 && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      Paga
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      ${shpallja.pagaPrej}–${shpallja.pagaDeri}
                    </span>
                  </div>
                )}
                {shpallja.lokacioniPunes && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      Lokacioni
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {shpallja.lokacioniPunes}
                    </span>
                  </div>
                )}
                {shpallja.niveliPunes && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      Niveli
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {shpallja.niveliPunes}
                    </span>
                  </div>
                )}
                {shpallja.orari && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      Orari
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {Array.isArray(shpallja.orari)
                        ? shpallja.orari[0]
                        : shpallja.orari}
                    </span>
                  </div>
                )}
                {shpallja.eksperienca && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      Eksperienca
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {shpallja.eksperienca}
                    </span>
                  </div>
                )}
                {shpallja.numriAplikimeve !== undefined && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      Aplikante
                    </span>
                    <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="text-gray-400 text-xs"
                      />
                      {shpallja.numriAplikimeve}
                    </span>
                  </div>
                )}

                {perdoruesiData?.tipiPerdoruesit !== "punedhenes" && (
                  <>
                    {kaAplikuar ? (
                      <div className="w-full mt-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center font-medium">
                        Keni aplikuar tashmë
                      </div>
                    ) : (
                      <button
                        onClick={aplikoTani}
                        className="publikoPune w-full mt-3"
                      >
                        Apliko
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-sm"
                        />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* About Company Card */}
            <div className="bg-white/70 border border-[#F7FBFC] rounded-2xl shadow-lg p-6">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
                Rreth kompanisë
              </h3>
              <div className="flex items-center gap-3 mb-4">
                {hasPhoto ? (
                  <img
                    src={shpallja.fotoProfili}
                    alt="Company Logo"
                    className="w-10 h-10 rounded-lg object-cover border border-[#D6E6F2] shrink-0"
                    onError={handlePhotoError}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">
                      {getCompanyName().substring(0, 2)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {getCompanyName()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {shpallja.emailKompanise}
                  </p>
                </div>
              </div>

              {/* View Company Button */}
              {shpallja.perdoruesiId._id && (
                <button
                  onClick={() =>
                    navigate(`/kompania/${shpallja.perdoruesiId._id}`)
                  }
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Shiko Kompaninë
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shpallja;
