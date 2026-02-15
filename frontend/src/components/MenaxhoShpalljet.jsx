import Header from "./Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowDownWideNarrow,
  Mail,
  X,
  User,
  BriefcaseBusiness,
  FileText,
  MapPin,
  Calendar,
  Building,
  Phone,
} from "lucide-react";
import {
  faSearch,
  faEllipsisVertical,
  faPencil,
  faTrash,
  faCheck,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../contexts/AlertContext";
import Perdoruesi from "../PerdoruesiContext";

function MenaxhoShpalljet() {
  const { showAlert } = useAlert();
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();
  const [shpalljaData, setShpalljaData] = useState([]);
  const [shpalljaKlikuar, setShpalljaKlikuar] = useState(null);
  const [filtrimiFaqes, setFiltrimiFaqes] = useState("Active");
  const [kerko, setKerko] = useState("");
  const [shfaqMeny, setShfaqMeny] = useState(null);
  const [menyRadhitjes, setMenyRadhitjes] = useState(false);
  const [sortimiDates, setSortimiDates] = useState("teRejat");
  const [isSaving, setIsSaving] = useState(false);

  const [aplikimet, setAplikimet] = useState([]);
  const [aplikimiKlikuar, setAplikimiKlikuar] = useState(null);
  const [shfaqPopupAplikanteve, setShfaqPopupAplikanteve] = useState(false);
  const [shpalljaZgjedhurPerAplikante, setShpalljaZgjedhurPerAplikante] =
    useState(null);
  const [shfaqPopupPranuar, setShfaqPopupPranuar] = useState(false);
  const [shfaqPopupRefuzuar, setShfaqPopupRefuzuar] = useState(false);

  const [fotoAplikanteve, setFotoAplikanteve] = useState({});

  const fetchShpalljet = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/shpallja/kompania",
      );
      if (Array.isArray(response.data.data)) {
        const shpalljetFiltruara = response.data.data.filter((shpallja) => {
          return (
            shpallja?.emailKompanise?.toLowerCase() ===
            perdoruesiData?.email?.toLowerCase()
          );
        });
        setShpalljaData(shpalljetFiltruara);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (perdoruesiData?.email) {
      fetchShpalljet();
    }
  }, [perdoruesiData]);

  useEffect(() => {
    const fetchData = async () => {
      if (!shpalljaZgjedhurPerAplikante) {
        setAplikimet([]);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/shpallja/${shpalljaZgjedhurPerAplikante._id}/aplikimet`,
        );

        if (response.data.success) {
          console.log("Aplikimet data:", response.data.aplikimet);
          setAplikimet(response.data.aplikimet);

          // Ngarko fotot e aplikanteve
          await ngarkoFotoAplikanteve(response.data.aplikimet);
        }
      } catch (error) {
        console.error(error);
        setAplikimet([]);
      }
    };

    fetchData();
  }, [shpalljaZgjedhurPerAplikante]);

  // Funksion per te ngarkuar fotot e aplikanteve
  const ngarkoFotoAplikanteve = async (aplikimet) => {
    const fotot = {};

    for (const aplikimi of aplikimet) {
      try {
        // Kerko perdoruesin sipas email-it
        const response = await axios.get(
          `http://localhost:3000/api/profili/email/${aplikimi.emailAplikantit}`,
        );

        if (response.data.success && response.data.data) {
          const perdoruesiId = response.data.data._id;

          // Kontrollo nese perdoruesi ka foto dhe foto.data (buffer)
          if (response.data.data.foto && response.data.data.foto.data) {
            fotot[aplikimi.emailAplikantit] =
              `http://localhost:3000/api/profili/${perdoruesiId}/foto?t=${Date.now()}`;
          }
        }
      } catch (error) {
        console.log(
          `Foto nuk u gjet per: ${aplikimi.emailAplikantit}, ${error}`,
        );
      }
    }

    setFotoAplikanteve(fotot);
  };

  const modifikoShpalljen = (e) => {
    const { id, value } = e.target;

    if (id === "aftesitePrimare" || id === "aftesiteSekondare") {
      // Convert comma‑separated string to array of trimmed, non‑empty strings
      const arrayValue = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      setShpalljaKlikuar((prev) => ({ ...prev, [id]: arrayValue }));
    } else {
      setShpalljaKlikuar((prev) => ({ ...prev, [id]: value }));
    }
  };

  const fshijShpalljen = async (idShpallja) => {
    try {
      const confirmed = window.confirm(
        "A jeni i sigurt qe doni ta fshini shpalljen?",
      );
      if (confirmed) {
        await axios.delete(`http://localhost:3000/api/shpallja/${idShpallja}`);
        setShpalljaData(shpalljaData.filter((sh) => sh._id !== idShpallja));
        setShpalljaKlikuar(null);
        setShfaqMeny(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ruajNdryshimet = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.put(
        `http://localhost:3000/api/shpallja/${shpalljaKlikuar._id}`,
        shpalljaKlikuar,
      );
      setShpalljaData(
        shpalljaData.map((sh) =>
          sh._id === shpalljaKlikuar._id ? shpalljaKlikuar : sh,
        ),
      );
      showAlert("Ndryshimet u ruajten", "info");
      setShpalljaKlikuar(null);
    } catch (error) {
      console.error(error);
      showAlert("Ndodhi një gabim gjatë ruajtjes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const ruajNdryshimetAplikimit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/shpallja/aplikimi/${aplikimiKlikuar._id}`,
        aplikimiKlikuar,
      );

      if (response.data.data.status) {
        setAplikimet((prevAplikimet) =>
          prevAplikimet.map((aplikim) =>
            aplikim._id === aplikimiKlikuar._id
              ? { ...aplikim, status: aplikimiKlikuar.status }
              : aplikim,
          ),
        );
      }

      await fetchShpalljet();

      showAlert("Ndryshimet u ruajten", "info");
      setAplikimiKlikuar(null);
    } catch (error) {
      console.error(error);
    }
  };

  const shfaqAplikantPopup = (e, shpallja) => {
    e.stopPropagation();
    setShpalljaZgjedhurPerAplikante(shpallja);
    setShfaqPopupAplikanteve(true);
    setShfaqMeny(null);
  };

  const mbyllAplikantPopup = () => {
    setShfaqPopupAplikanteve(false);
    setShpalljaZgjedhurPerAplikante(null);
    setAplikimiKlikuar(null);
    setFotoAplikanteve({});
  };

  const shfaqAplikantPranuar = (e, shpallja) => {
    e.stopPropagation();
    setShpalljaZgjedhurPerAplikante(shpallja);
    setShfaqPopupPranuar(true);
    setShfaqMeny(null);
  };

  const shfaqAplikantRefuzuar = (e, shpallja) => {
    e.stopPropagation();
    setShpalljaZgjedhurPerAplikante(shpallja);
    setShfaqPopupRefuzuar(true);
    setShfaqMeny(null);
  };

  const mbyllPopupPranuar = () => {
    setShfaqPopupPranuar(false);
    setShpalljaZgjedhurPerAplikante(null);
    setAplikimet([]);
  };

  const mbyllPopupRefuzuar = () => {
    setShfaqPopupRefuzuar(false);
    setShpalljaZgjedhurPerAplikante(null);
    setAplikimet([]);
  };

  const hapAplikimin = (aplikimi) => {
    setAplikimiKlikuar(aplikimi);
  };

  const mbyllAplikimin = () => {
    setAplikimiKlikuar(null);
  };

  // const modifikoAplikimin = (e) => {
  //   const { id, value } = e.target;
  //   setAplikimiKlikuar({
  //     ...aplikimiKlikuar,
  //     [id]: value,
  //   });
  // };

  const sortimDates = (data) => {
    const sorted = [...data].sort((a, b) => {
      const dateA = new Date(a.dataKrijimit);
      const dateB = new Date(b.dataKrijimit);
      return sortimiDates === "teRejat" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  };

  const shpalljaSkaduar = (dk) => {
    const dataKrijimit = new Date(dk);
    const tani = new Date();

    const diferenca = tani - dataKrijimit;
    const tridhjeteDite = 30 * 24 * 60 * 60 * 1000;
    // const dyMinuta = 2 * 60 * 1000;

    return diferenca > tridhjeteDite;
  };

  const filteredData = sortimDates(
    shpalljaData.filter((sh) => {
      const matchesSearch = sh.pozitaPunes
        .toLowerCase()
        .includes(kerko.toLowerCase());

      const isExpired = sh.status === "skaduar";

      if (filtrimiFaqes === "Active") {
        return matchesSearch && !isExpired;
      } else if (filtrimiFaqes === "Expired") {
        return matchesSearch && isExpired;
      }

      return matchesSearch;
    }),
  );

  const handleDownloadCv = async (aplikimiId, filename) => {
    try {
      window.open(
        `http://localhost:3000/api/shpallja/${aplikimiId}/download`,
        "_blank",
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Menaxho Shpalljet
          </h1>
          <p className="paragraf mt-1">
            Menaxho dhe modifiko shpalljet e pozitave të punës
          </p>
        </div>

        <div className="tabela">
          <div className="flex space-x-8 overflow-x-auto pb-2 lg:pb-4">
            {["Active", "Expired"].map((faqja) => (
              <button
                key={faqja}
                onClick={() => setFiltrimiFaqes(faqja)}
                className={`whitespace-nowrap text-sm font-medium transition-colors relative ${
                  filtrimiFaqes === faqja
                    ? "text-gray-900 border-b-2 border-indigo-600 pb-4"
                    : "text-gray-500 hover:text-gray-700 pb-4"
                }`}
              >
                {faqja}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
              />
              <input
                type="text"
                placeholder="Search shpalljet..."
                value={kerko}
                onChange={(e) => setKerko(e.target.value)}
                className="input-kerkimi"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setMenyRadhitjes(!menyRadhitjes)}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 w-full sm:w-auto"
              >
                <ArrowDownWideNarrow size={18} />
                <span>Radhit</span>
              </button>

              {menyRadhitjes && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Radhit sipas Dates
                    </p>
                    <button
                      onClick={() => {
                        setSortimiDates("teRejat");
                        setMenyRadhitjes(false);
                      }}
                      className="butonSortimi"
                    >
                      <span>Më e re</span>
                      {sortimiDates === "teRejat" && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-indigo-600 text-xs"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSortimiDates("teVjetrat");
                        setMenyRadhitjes(false);
                      }}
                      className="butonSortimi"
                    >
                      <span>Më e vjetër</span>
                      {sortimiDates === "teVjetrat" && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-indigo-600 text-xs"
                        />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-visible">
          <div className="hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="tableHead">Pozita</th>
                  <th className="tableHead">Data e Publikimit</th>
                  <th className="tableHead">Lokacioni</th>
                  <th className="tableHead text-center">Orari</th>
                  <th className="tableHead">Aplikimet ne Pritje</th>
                  <th className="tableHead">Aplikimet e Pranuara</th>
                  <th className="tableHead">Aplikimet e Refuzuara</th>
                  <th className="tableHead text-right">Veprime</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((sh) => (
                  <tr key={sh._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {sh.pozitaPunes}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sh.kategoriaPunes}
                      </div>
                    </td>
                    <td className="tableData text-gray-500">
                      {new Date(sh.dataKrijimit).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="tableData text-gray-900">
                      {sh.lokacioniPunes}
                    </td>
                    <td className="tableData">
                      <span className="py-1 w-full items-center justify-center inline-flex text-sm font-medium">
                        {sh.orari}
                      </span>
                    </td>
                    <td className="tableData">
                      <button
                        onClick={(e) => shfaqAplikantPopup(e, sh)}
                        className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        {sh.numriNePritje} aplikant
                      </button>
                    </td>
                    <td className="tableData">
                      <button
                        onClick={(e) => shfaqAplikantPranuar(e, sh)}
                        className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        {sh.numriPranuar} aplikant
                      </button>
                    </td>
                    <td className="tableData">
                      <button
                        onClick={(e) => shfaqAplikantRefuzuar(e, sh)}
                        className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        {sh.numriRefuzuar} aplikant
                      </button>
                    </td>
                    <td className="tableData text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShfaqMeny(shfaqMeny === sh._id ? null : sh._id)
                          }
                          className="text-gray-400 hover:text-gray-600 p-2"
                        >
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                        {shfaqMeny === sh._id && (
                          <div className="absolute right-6  top-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                              onClick={() => {
                                setShpalljaKlikuar({
                                  ...sh,
                                  aftesitePrimare: sh.aftesitePrimare || [],
                                  aftesiteSekondare: sh.aftesiteSekondare || [],
                                });
                                setShfaqMeny(null);
                              }}
                              className="butonModifikimi"
                            >
                              <FontAwesomeIcon
                                icon={faPencil}
                                className="text-sm"
                              />
                              <span>Modifiko</span>
                            </button>
                            <button
                              onClick={() => fshijShpalljen(sh._id)}
                              className="butonModifikimi text-red-600 "
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-sm"
                              />
                              <span>Fshij</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-gray-200">
            {filteredData.map((sh) => (
              <div key={sh._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="text-base font-medium text-gray-900 mb-1">
                      {sh.pozitaPunes}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {sh.kategoriaPunes}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        {new Date(sh.dataKrijimit).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-2 text-gray-400" />
                        {sh.lokacioniPunes}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Building size={14} className="mr-2 text-gray-400" />
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {sh.orari}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-2">
                    <button
                      onClick={() =>
                        setShfaqMeny(shfaqMeny === sh._id ? null : sh._id)
                      }
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>

                    {shfaqMeny === sh._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => {
                            setShpalljaKlikuar(sh);
                            setShfaqMeny(null);
                          }}
                          className="butonModifikimi"
                        >
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="text-sm"
                          />
                          <span>Modifiko</span>
                        </button>
                        <button
                          onClick={() => fshijShpalljen(sh._id)}
                          className="butonMofifikimi text-red-600"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                          <span>Fshij</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => shfaqAplikantPopup(e, sh)}
                    className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    {sh.numriAplikimeve || 0} aplikant
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nuk ka shpallje për të shfaqur
            </div>
          )}
        </div>
      </div>

      {shpalljaKlikuar && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-fit overflow-y-auto shadow-xl">
            <div className="bg-[#f8f8f9] p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Modifiko Shpalljen</h2>
              <button
                onClick={() => setShpalljaKlikuar(null)}
                className="cursor-pointer text-xl hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={ruajNdryshimet} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="pozitaPunes" className="labelTabela">
                      Pozita e punes
                    </label>
                    <input
                      id="pozitaPunes"
                      type="text"
                      value={shpalljaKlikuar.pozitaPunes}
                      onChange={modifikoShpalljen}
                      className="input-ShpalljaProfil"
                      placeholder="Senior Full Stack Developer"
                    />
                  </div>

                  <div>
                    <label htmlFor="niveliPunes" className="labelTabela">
                      Niveli i punes
                    </label>
                    <input
                      id="niveliPunes"
                      type="text"
                      value={shpalljaKlikuar.niveliPunes || ""}
                      onChange={modifikoShpalljen}
                      className="input-ShpalljaProfil"
                      placeholder="Full-time"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lokacioniPunes" className="labelTabela">
                    Lokacioni i punes
                  </label>
                  <input
                    id="lokacioniPunes"
                    type="text"
                    value={shpalljaKlikuar.lokacioniPunes || ""}
                    onChange={modifikoShpalljen}
                    className="input-ShpalljaProfil"
                    placeholder="Pristina, Kosovo"
                  />
                </div>

                <div>
                  <label htmlFor="llojiPunes" className="labelTabela">
                    Lloji i Punes
                  </label>
                  <input
                    id="llojiPunes"
                    type="text"
                    value={shpalljaKlikuar.llojiPunes || ""}
                    onChange={modifikoShpalljen}
                    className="input-ShpalljaProfil"
                    placeholder="Full-time"
                  />
                </div>

                <div>
                  <label htmlFor="pershkrimiPunes" className="labelTabela">
                    Pershkrimi i punes
                  </label>
                  <textarea
                    id="pershkrimiPunes"
                    value={shpalljaKlikuar.pershkrimiPunes || ""}
                    onChange={modifikoShpalljen}
                    rows="5"
                    className="input-ShpalljaProfil"
                    placeholder="Pershkrimi"
                  />
                </div>

                {/* New skills fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aftesite Primare */}
                  <div>
                    <label className="labelTabela">Aftesite Primare</label>
                    {shpalljaKlikuar.aftesitePrimare?.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const newSkills = [
                              ...shpalljaKlikuar.aftesitePrimare,
                            ];
                            newSkills[index] = e.target.value;
                            setShpalljaKlikuar({
                              ...shpalljaKlikuar,
                              aftesitePrimare: newSkills,
                            });
                          }}
                          className="input-ShpalljaProfil flex-1"
                          placeholder="Shkruaj nje aftesi"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills =
                              shpalljaKlikuar.aftesitePrimare.filter(
                                (_, i) => i !== index,
                              );
                            setShpalljaKlikuar({
                              ...shpalljaKlikuar,
                              aftesitePrimare: newSkills,
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newSkills = [
                          ...(shpalljaKlikuar.aftesitePrimare || []),
                          "",
                        ];
                        setShpalljaKlikuar({
                          ...shpalljaKlikuar,
                          aftesitePrimare: newSkills,
                        });
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800 mt-2"
                    >
                      + Shto aftesi primare
                    </button>
                  </div>

                  {/* Aftesite Sekondare - NO mt-6 */}
                  <div>
                    <label className="labelTabela">Aftesite Sekondare</label>
                    {shpalljaKlikuar.aftesiteSekondare?.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const newSkills = [
                              ...shpalljaKlikuar.aftesiteSekondare,
                            ];
                            newSkills[index] = e.target.value;
                            setShpalljaKlikuar({
                              ...shpalljaKlikuar,
                              aftesiteSekondare: newSkills,
                            });
                          }}
                          className="input-ShpalljaProfil flex-1"
                          placeholder="Shkruaj nje aftesi"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills =
                              shpalljaKlikuar.aftesiteSekondare.filter(
                                (_, i) => i !== index,
                              );
                            setShpalljaKlikuar({
                              ...shpalljaKlikuar,
                              aftesiteSekondare: newSkills,
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newSkills = [
                          ...(shpalljaKlikuar.aftesiteSekondare || []),
                          "",
                        ];
                        setShpalljaKlikuar({
                          ...shpalljaKlikuar,
                          aftesiteSekondare: newSkills,
                        });
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800 mt-2"
                    >
                      + Shto aftesi sekondare
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button
                    type="button"
                    disabled={isSaving}
                    className="publikoPune bg-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => fshijShpalljen(shpalljaKlikuar._id)}
                  >
                    Fshij Shpalljen
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="publikoPune cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Duke ruajtur..." : "Perfundo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {shfaqPopupAplikanteve && shpalljaZgjedhurPerAplikante && (
        <div className="fixed bg-black/20 inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div>
              <div
                className="bg-[#f8f8f9] p-6 sticky top-0 flex items-start justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold mb-2">
                    {shpalljaZgjedhurPerAplikante.pozitaPunes} - Aplikantët në
                    Pritje
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 flex justify-between items-center gap-2 rounded-full text-sm font-semibold">
                      <User size={16} />{" "}
                      {aplikimet.filter((a) => a.status === "Ne_Pritje").length}{" "}
                      Aplikantë
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold">
                      <FontAwesomeIcon icon={faLocationDot} />
                      {shpalljaZgjedhurPerAplikante.lokacioniPunes}
                    </span>
                  </div>
                </div>
                <button
                  onClick={mbyllAplikantPopup}
                  className="cursor-pointer text-xl hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              {aplikimet.filter((a) => a.status === "Ne_Pritje").length ===
              0 ? (
                <p className="text-gray-500 text-center py-8 italic">
                  Nuk ka aplikantë në pritje për këtë pozitë
                </p>
              ) : (
                <div className="space-y-3">
                  {aplikimet
                    .filter((a) => a.status === "Ne_Pritje")
                    .map((a) => (
                      <div
                        key={a._id}
                        className="rounded-lg p-4 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                                {fotoAplikanteve[a.emailAplikantit] ? (
                                  <img
                                    src={fotoAplikanteve[a.emailAplikantit]}
                                    alt={`${a.emriAplikantit} ${a.mbiemriAplikantit}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      const parent = e.target.parentElement;
                                      parent.innerHTML = `<span class="text-blue-600">${a.emriAplikantit?.charAt(0)}${a.mbiemriAplikantit?.charAt(0)}</span>`;
                                    }}
                                  />
                                ) : (
                                  <span className="text-blue-600">
                                    {a.emriAplikantit?.charAt(0)}
                                    {a.mbiemriAplikantit?.charAt(0)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                {a.emriAplikantit} {a.mbiemriAplikantit}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail
                                  size={16}
                                  className="text-secondary shrink-0"
                                />
                                <p className="text-sm truncate">
                                  {a.emailAplikantit}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="grid place-self-center publikoPune ml-4 sm:ml-0 sm:mt-0 mt-3"
                            onClick={() => hapAplikimin(a)}
                          >
                            Shiko Me Shume
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup for Accepted Applicants */}
      {shfaqPopupPranuar && shpalljaZgjedhurPerAplikante && (
        <div className="fixed bg-black/20 inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div>
              <div className="bg-[#f8f8f9] p-6 sticky top-0 flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold mb-2">
                    {shpalljaZgjedhurPerAplikante.pozitaPunes} - Aplikantët e
                    Pranuar
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 flex justify-between items-center gap-2 rounded-full text-sm font-semibold">
                      <User size={16} />{" "}
                      {aplikimet.filter((a) => a.status === "Pranuar").length}{" "}
                      Aplikantë të Pranuar
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold">
                      <FontAwesomeIcon icon={faLocationDot} />
                      {shpalljaZgjedhurPerAplikante.lokacioniPunes}
                    </span>
                  </div>
                </div>
                <button
                  onClick={mbyllPopupPranuar}
                  className="cursor-pointer text-xl hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              {aplikimet.filter((a) => a.status === "Pranuar").length === 0 ? (
                <p className="text-gray-500 text-center py-8 italic">
                  Nuk ka aplikantë të pranuar për këtë pozitë
                </p>
              ) : (
                <div className="space-y-3">
                  {aplikimet
                    .filter((a) => a.status === "Pranuar")
                    .map((a) => (
                      <div
                        key={a._id}
                        className="rounded-lg p-4 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                                {fotoAplikanteve[a.emailAplikantit] ? (
                                  <img
                                    src={fotoAplikanteve[a.emailAplikantit]}
                                    alt={`${a.emriAplikantit} ${a.mbiemriAplikantit}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      const parent = e.target.parentElement;
                                      parent.innerHTML = `<span class="text-blue-600">${a.emriAplikantit?.charAt(0)}${a.mbiemriAplikantit?.charAt(0)}</span>`;
                                    }}
                                  />
                                ) : (
                                  <span className="text-blue-600">
                                    {a.emriAplikantit?.charAt(0)}
                                    {a.mbiemriAplikantit?.charAt(0)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                {a.emriAplikantit} {a.mbiemriAplikantit}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail
                                  size={16}
                                  className="text-secondary shrink-0"
                                />
                                <p className="text-sm truncate">
                                  {a.emailAplikantit}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="grid place-self-center publikoPune ml-4 sm:ml-0 sm:mt-0 mt-3"
                            onClick={() => hapAplikimin(a)}
                          >
                            Shiko Me Shume
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup for Rejected Applicants */}
      {shfaqPopupRefuzuar && shpalljaZgjedhurPerAplikante && (
        <div className="fixed bg-black/20 inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div>
              <div className="bg-[#f8f8f9] p-6 sticky top-0 flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold mb-2">
                    {shpalljaZgjedhurPerAplikante.pozitaPunes} - Aplikantët e
                    Refuzuar
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 flex justify-between items-center gap-2 rounded-full text-sm font-semibold">
                      <User size={16} />{" "}
                      {aplikimet.filter((a) => a.status === "Refuzuar").length}{" "}
                      Aplikantë të Refuzuar
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold">
                      <FontAwesomeIcon icon={faLocationDot} />
                      {shpalljaZgjedhurPerAplikante.lokacioniPunes}
                    </span>
                  </div>
                </div>
                <button
                  onClick={mbyllPopupRefuzuar}
                  className="cursor-pointer text-xl hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              {aplikimet.filter((a) => a.status === "Refuzuar").length === 0 ? (
                <p className="text-gray-500 text-center py-8 italic">
                  Nuk ka aplikantë të refuzuar për këtë pozitë
                </p>
              ) : (
                <div className="space-y-3">
                  {aplikimet
                    .filter((a) => a.status === "Refuzuar")
                    .map((a) => (
                      <div
                        key={a._id}
                        className="rounded-lg p-4 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                                {fotoAplikanteve[a.emailAplikantit] ? (
                                  <img
                                    src={fotoAplikanteve[a.emailAplikantit]}
                                    alt={`${a.emriAplikantit} ${a.mbiemriAplikantit}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      const parent = e.target.parentElement;
                                      parent.innerHTML = `<span class="text-blue-600">${a.emriAplikantit?.charAt(0)}${a.mbiemriAplikantit?.charAt(0)}</span>`;
                                    }}
                                  />
                                ) : (
                                  <span className="text-blue-600">
                                    {a.emriAplikantit?.charAt(0)}
                                    {a.mbiemriAplikantit?.charAt(0)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                {a.emriAplikantit} {a.mbiemriAplikantit}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail
                                  size={16}
                                  className="text-secondary shrink-0"
                                />
                                <p className="text-sm truncate">
                                  {a.emailAplikantit}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="grid place-self-center publikoPune ml-4 sm:ml-0 sm:mt-0 mt-3"
                            onClick={() => hapAplikimin(a)}
                          >
                            Shiko Me Shume
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {aplikimiKlikuar && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-60 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="relative px-6 py-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Foto e aplikantit ne detaje */}
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-xl shadow-lg overflow-hidden flex-shrink-0">
                    {fotoAplikanteve[aplikimiKlikuar.emailAplikantit] ? (
                      <img
                        src={fotoAplikanteve[aplikimiKlikuar.emailAplikantit]}
                        alt={`${aplikimiKlikuar.emriAplikantit} ${aplikimiKlikuar.mbiemriAplikantit}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          const parent = e.target.parentElement;
                          parent.innerHTML = `<span class="text-blue-600">${aplikimiKlikuar.emriAplikantit?.charAt(0)}${aplikimiKlikuar.mbiemriAplikantit?.charAt(0)}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-blue-600">
                        {aplikimiKlikuar.emriAplikantit?.charAt(0)}
                        {aplikimiKlikuar.mbiemriAplikantit?.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      {aplikimiKlikuar.emriAplikantit}{" "}
                      {aplikimiKlikuar.mbiemriAplikantit}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {aplikimiKlikuar.emailAplikantit}
                    </p>
                  </div>
                </div>

                <button
                  onClick={mbyllAplikimin}
                  className="cursor-pointer text-xl hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -z-10"></div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="detajetAplikantit">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span className="spanAplikanti">Emri</span>
                  </div>
                  <p className="px-1.5 text-lg font-semibold text-gray-900">
                    {aplikimiKlikuar.emriAplikantit}
                  </p>
                </div>

                <div className="detajetAplikantit">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span className="spanAplikanti">Mbiemri</span>
                  </div>
                  <p className="px-1.5 text-lg font-semibold text-gray-900">
                    {aplikimiKlikuar.mbiemriAplikantit}
                  </p>
                </div>
              </div>
              <div className="detajetAplikantit">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <span className="spanAplikanti">Email</span>
                </div>
                <p className="px-1.5 text-base font-medium text-gray-900">
                  {aplikimiKlikuar.emailAplikantit}
                </p>
              </div>
              <div className="detajetAplikantit">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <span className="spanAplikanti">Nr-Tel</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="px-1.5 text-base font-medium text-gray-900">
                    {aplikimiKlikuar.nrTelefonit}
                  </p>
                </div>
              </div>
              <div className="detajetAplikantit">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <BriefcaseBusiness size={16} />
                  </div>
                  <span className="spanAplikanti">Eksperienca</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="px-1.5 text-base font-medium text-gray-900">
                    {aplikimiKlikuar.eksperienca}
                  </p>
                </div>
              </div>
              {aplikimiKlikuar.aftesite.length > 0 && (
                <div className="detajetAplikantit">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <BriefcaseBusiness size={16} />
                    </div>
                    <span className="spanAplikanti">Aftesite</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {aplikimiKlikuar.aftesite.map((af) => (
                      <p className="px-1.5 text-base font-medium text-gray-900">
                        {af.toUpperCase()}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <span className="spanAplikanti">Letra Motivuese</span>
                </div>
                <div className="bg-linear-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 max-h-48 overflow-y-auto border border-gray-200">
                  <p className="px-1.5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {aplikimiKlikuar.letraMotivuese}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center bg-linear-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 max-h-48 overflow-y-auto border border-gray-200">
                  <p className="px-1.5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {aplikimiKlikuar.emriFileCv}
                  </p>
                  <button
                    type="button"
                    className="publikoPune"
                    onClick={() =>
                      handleDownloadCv(
                        aplikimiKlikuar._id,
                        aplikimiKlikuar.emriFileCv,
                      )
                    }
                  >
                    Shkarko CV
                  </button>
                </div>
              </div>
              {aplikimiKlikuar.status === "Ne_Pritje" &&
              shpalljaZgjedhurPerAplikante.status === "skaduar" ? (
                <select
                  id="status"
                  onChange={(e) =>
                    setAplikimiKlikuar({
                      ...aplikimiKlikuar,
                      status: e.target.value,
                    })
                  }
                >
                  <option value={`${aplikimiKlikuar.status}`} default hidden>
                    {aplikimiKlikuar.status}
                  </option>
                  <option value="Pranuar">Prano</option>
                  <option value="Refuzuar">Refuzo</option>
                </select>
              ) : (
                <p>{aplikimiKlikuar.status}</p>
              )}
            </div>

            <div className="px-6 py-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 rounded-b-2xl flex justify-end items-center gap-3">
              <button
                onClick={mbyllAplikimin}
                className="px-5 py-2.5 text-sm text-white font-semibold hover:text-black bg-primary hover:bg-white hover:border rounded-xl transition-all duration-200"
              >
                Mbyll
              </button>
              <button
                onClick={ruajNdryshimetAplikimit}
                className="px-5 py-2.5 text-sm text-white font-semibold hover:text-black bg-primary hover:bg-white hover:border rounded-xl transition-all duration-200"
              >
                Ruaj Ndryshimet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenaxhoShpalljet;
