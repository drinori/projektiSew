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
  const navigate = useNavigate();
  const [shpallja, setShpallja] = useState(null);
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();
  const [eshteRuajtur, setEshteRuajtur] = useState(false);
  const [duke_ngarkuar, setDuke_ngarkuar] = useState(false);
  const [fotoError, setFotoError] = useState(false);

  const handlePhotoError = () => setFotoError(true);

  const getCompanyName = () => {
    if (!shpallja?.emailKompanise) return "COMPANY";
    return shpallja.emailKompanise.split("@")[0].toUpperCase();
  };

  const { id } = useParams();

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
    <div className="min-h-screen bg-gray-50">
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

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Logo + Company + Title */}
            <div className="flex items-start gap-4">
              {hasPhoto ? (
                <img
                  src={shpallja.fotoProfili}
                  alt="Company Logo"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                  onError={handlePhotoError}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center border border-gray-200 flex-shrink-0">
                  <span className="text-white font-bold text-xl">
                    {getCompanyName().substring(0, 2)}
                  </span>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  {getCompanyName()}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {shpallja.pozitaPunes}
                </h1>
              </div>
            </div>

            {/* Bookmark - no border, just icon + label */}
            {perdoruesiData?.tipiPerdoruesit !== "punedhenes" && (
              <button
                onClick={ndryshoRuajtjen}
                disabled={duke_ngarkuar}
                className={`self-start flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium bg-transparent hover:bg-gray-100 ${
                  eshteRuajtur
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                } ${duke_ngarkuar ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <FontAwesomeIcon
                  icon={eshteRuajtur ? faBookmarkSolid : faBookmarkRegular}
                />
                {eshteRuajtur ? "Ruajtur" : "Ruaj"}
              </button>
            )}
          </div>

          {/* Tag pills - all neutral gray */}
          <div className="flex flex-wrap gap-2 mt-5">
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
                <FontAwesomeIcon icon={faClock} className="text-gray-500" />
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
                <FontAwesomeIcon icon={faBriefcase} className="text-gray-500" />
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

        {/* Main Content + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left: Content ── */}
          <div className="flex-1 space-y-6">
            {/* Job Description */}
            {shpallja.pershkrimiPunes && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
                  Pershkrimi i Punës
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {shpallja.pershkrimiPunes}
                </p>
              </div>
            )}

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
                Përgjegjësitë
              </h2>
              {shpallja.pyetjet && shpallja.pyetjet.length > 0 ? (
                <ul className="space-y-3">
                  {shpallja.pyetjet.map((pyetja, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                      <span className="text-gray-600 leading-relaxed">
                        {pyetja}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-sm">
                  Nuk ka përgjegjësi të specifikuara.
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
                Aftesite e Detyrueshme
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
                  Nuk ka aftesi të specifikuara.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
                Aftesite Opsionale
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
                  Nuk ka aftesi të specifikuara.
                </p>
              )}
            </div>
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="lg:w-80 space-y-4">
            {/* Apply Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Apliko tani
              </h3>

              {perdoruesiData?.tipiPerdoruesit !== "punedhenes" && (
                <button
                  onClick={aplikoTani}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mb-5"
                >
                  Apliko
                  <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                </button>
              )}

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
              </div>
            </div>

            {/* About Company Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Rreth kompanisë
              </h3>
              <div className="flex items-center gap-3">
                {hasPhoto ? (
                  <img
                    src={shpallja.fotoProfili}
                    alt="Company Logo"
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    onError={handlePhotoError}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shpallja;
