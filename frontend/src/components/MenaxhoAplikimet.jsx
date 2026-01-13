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
} from "lucide-react";
import {
  faSearch,
  faEllipsisVertical,
  faPencil,
  faTrash,
  faCheck,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

function MenaxhoAplikimet() {
  const [perdoruesiData, setPerdoruesiData] = useState({});
  const [shpalljaData, setShpalljaData] = useState([]);
  const [shpalljaKlikuar, setShpalljaKlikuar] = useState(null);
  const [filtrimiFaqes, setFiltrimiFaqes] = useState("Active");
  const [kerko, setKerko] = useState("");
  const [shfaqMeny, setShfaqMeny] = useState(null);
  const [menyRadhitjes, setMenyRadhitjes] = useState(false);
  const [sortimiDates, setSortimiDates] = useState("teRejat");

  // Applicants related state
  const [aplikimet, setAplikimet] = useState([]);
  const [aplikimiKlikuar, setAplikimiKlikuar] = useState(null);
  const [shfaqPopupAplikanteve, setShfaqPopupAplikanteve] = useState(false);
  const [shpalljaZgjedhurPerAplikante, setShpalljaZgjedhurPerAplikante] =
    useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profili/${id}`,
        );
        setPerdoruesiData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/shpallja/aplikimet",
        );
        if (Array.isArray(response.data.data)) {
          const aplikimetFiltruara = response.data.data.filter((aplikimi) => {
            return aplikimi.emailKompanise === perdoruesiData.email;
          });
          if (aplikimetFiltruara.length > 0) {
            setAplikimet(aplikimetFiltruara);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [perdoruesiData.email]);

  useEffect(() => {
    const fetchData = async () => {
      const shpalljet = [];

      for (const aplikimi of aplikimet) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/shpallja/${aplikimi.shpalljaId}`,
          );

          shpalljet.push(response.data.data);
        } catch (error) {
          console.error(error);
        }
      }

      setShpalljaData(shpalljet);
    };

    fetchData();
  }, [aplikimet]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!shpalljaZgjedhurPerAplikante) {
  //       setAplikimet([]);
  //       return;
  //     }
  //
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3000/api/shpallja/${shpalljaZgjedhurPerAplikante._id}/aplikimet`,
  //       );
  //
  //       if (response.data.success) {
  //         console.log("Aplikimet data:", response.data.aplikimet);
  //         setAplikimet(response.data.aplikimet);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       setAplikimet([]);
  //     }
  //   };
  //
  //   fetchData();
  // }, [shpalljaZgjedhurPerAplikante]);

  const modifikoShpalljen = (e) => {
    const { id, value } = e.target;
    setAplikimiKlikuar({
      ...aplikimiKlikuar,
      [id]: value,
    });
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
      alert("Ndryshimet u ruajten");
      setShpalljaKlikuar(null);
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
  };

  const hapAplikimin = (aplikimi) => {
    setAplikimiKlikuar(aplikimi);
  };

  const mbyllAplikimin = () => {
    setAplikimiKlikuar(null);
  };

  const sortimDates = (data) => {
    const sorted = [...data].sort((a, b) => {
      const dateA = new Date(a.dataKrijimit);
      const dateB = new Date(b.dataKrijimit);
      return sortimiDates === "teRejat" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  };

  const filteredData = sortimDates(
    shpalljaData.filter((sh) => {
      const matchesSearch = sh.pozitaPunes
        .toLowerCase()
        .includes(kerko.toLowerCase());
      return matchesSearch;
    }),
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Menaxho Aplikimet
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Menaxho dhe modifiko shpalljet e pozitave të punës
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 border-b border-gray-200 gap-4">
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
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
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center justify-between"
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
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center justify-between"
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

        {/* Responsive Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pozita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data e Publikimit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokacioni
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orari
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aplikimet
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veprime
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shpalljaData.map((sh) => (
                  <tr key={sh._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {sh.pozitaPunes}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sh.kategoriaPunes}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sh.dataKrijimit).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sh.lokacioniPunes}
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <span className="py-1 w-full items-center justify-center inline-flex text-sm font-medium">
                        {sh.orari}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => shfaqAplikantPopup(e, sh)}
                        className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        {sh.numriAplikimeve || 0} aplikant
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                              onClick={() => {
                                setShpalljaKlikuar(sh);
                                setShfaqMeny(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 rounded-t-lg"
                            >
                              <FontAwesomeIcon
                                icon={faPencil}
                                className="text-sm"
                              />
                              <span>Modifiko</span>
                            </button>
                            <button
                              onClick={() => fshijShpalljen(sh._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2 rounded-b-lg"
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

          {/* Mobile Cards */}
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
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 rounded-t-lg"
                        >
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="text-sm"
                          />
                          <span>Modifiko</span>
                        </button>
                        <button
                          onClick={() => fshijShpalljen(sh._id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2 rounded-b-lg"
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
                    <label
                      htmlFor="pozitaPunes"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
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
                    <label
                      htmlFor="niveliPunes"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
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
                  <label
                    htmlFor="lokacioniPunes"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
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
                  <label
                    htmlFor="llojiPunes"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
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
                  <label
                    htmlFor="pershkrimiPunes"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button
                    type="button"
                    className="publikoPune bg-red-500 cursor-pointer"
                    onClick={() => fshijShpalljen(shpalljaKlikuar._id)}
                  >
                    Fshij Shpalljen
                  </button>
                  <button type="submit" className="publikoPune cursor-pointer">
                    Perfundo
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
                    {shpalljaZgjedhurPerAplikante.pozitaPunes}
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 flex justify-between items-center gap-2 rounded-full text-sm font-semibold">
                      <User size={16} /> {aplikimet.length} Aplikant
                      {aplikimet.length !== 1 ? "ë" : ""}
                    </span>

                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold">
                      {" "}
                      <FontAwesomeIcon icon={faLocationDot} className="" />
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
              {aplikimet.length === 0 ? (
                <p className="text-gray-500 text-center py-8 italic">
                  Nuk ka aplikime për këtë pozitë
                </p>
              ) : (
                <div className="space-y-3">
                  {aplikimet.map((a) => (
                    <div
                      key={a._id}
                      className="rounded-lg p-4 hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                              {a.emriAplikantit?.charAt(0)}
                              {a.mbiemriAplikantit?.charAt(0)}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                              {a.emriAplikantit} {a.mbiemriAplikantit}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail
                                size={16}
                                className="text-[#3282B8] shrink-0"
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
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {aplikimiKlikuar.emriAplikantit}{" "}
                    {aplikimiKlikuar.mbiemriAplikantit}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {aplikimiKlikuar.emailAplikantit}
                  </p>
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
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Emri
                    </span>
                  </div>
                  <p className="px-1.5 text-lg font-semibold text-gray-900">
                    {aplikimiKlikuar.emriAplikantit}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Mbiemri
                    </span>
                  </div>
                  <p className="px-1.5 text-lg font-semibold text-gray-900">
                    {aplikimiKlikuar.mbiemriAplikantit}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </span>
                </div>
                <p className="px-1.5 text-base font-medium text-gray-900">
                  {aplikimiKlikuar.emailAplikantit}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <BriefcaseBusiness size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Eksperienca
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="px-1.5 text-base font-medium text-gray-900">
                    {aplikimiKlikuar.eksperienca}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Letra Motivuese
                  </span>
                </div>
                <div className="bg-linear-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 max-h-48 overflow-y-auto border border-gray-200">
                  <p className="px-1.5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {aplikimiKlikuar.letraMotivuese}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 rounded-b-2xl flex justify-end items-center gap-3">
              <button
                onClick={mbyllAplikimin}
                className="px-5 py-2.5 text-sm text-white font-semibold hover:text-black bg-[#0F4C75] hover:bg-white hover:border rounded-xl transition-all duration-200"
              >
                Mbyll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenaxhoAplikimet;
