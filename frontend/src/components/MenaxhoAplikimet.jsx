import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowDownWideNarrow,
  Calendar,
  MapPin,
  Building,
  X,
} from "lucide-react";
import Header from "./Header";
import {
  faSearch,
  faEllipsisVertical,
  faPencil,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

function MenaxhoAplikimet() {
  const [perdoruesiData, setPerdoruesiData] = useState({});
  const [shpalljaData, setShpalljaData] = useState([]);
  const [aplikimet, setAplikimet] = useState([]);
  const [aplikimiKlikuar, setAplikimiKlikuar] = useState(null);
  const [filtrimiFaqes, setFiltrimiFaqes] = useState("Active");
  const [kerko, setKerko] = useState("");
  const [shfaqMeny, setShfaqMeny] = useState(null);
  const [menyRadhitjes, setMenyRadhitjes] = useState(false);
  const [sortimiDates, setSortimiDates] = useState("teRejat");

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
            return aplikimi.emailAplikantit === perdoruesiData.email;
          });
          setAplikimet(aplikimetFiltruara);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (perdoruesiData.email) {
      fetchData();
    }
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

    if (aplikimet.length > 0) {
      fetchData();
    }
  }, [aplikimet]);

  const modifikoAplikimin = (e) => {
    const { id, value } = e.target;
    setAplikimiKlikuar({
      ...aplikimiKlikuar,
      [id]: value,
    });
  };

  const ruajNdryshimet = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/shpallja/aplikimi/${aplikimiKlikuar._id}`,
        aplikimiKlikuar,
      );
      setAplikimet(
        aplikimet.map((sh) =>
          sh._id === aplikimiKlikuar._id ? aplikimiKlikuar : sh,
        ),
      );
      alert("Ndryshimet u ruajten");
      setAplikimiKlikuar(null);
    } catch (error) {
      console.error(error);
    }
  };

  const sortimDates = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.dataKrijimit);
      const dateB = new Date(b.dataKrijimit);

      if (sortimiDates === "teRejat") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  };

  const filteredData = sortimDates(
    aplikimet.filter((aplikimi) => {
      const shpallja = shpalljaData.find(
        (sh) => sh._id === aplikimi.shpalljaId,
      );

      const jobStatus = shpallja?.status?.toLowerCase();
      const matchesStatus =
        (filtrimiFaqes === "Active" && jobStatus === "aktiv") ||
        (filtrimiFaqes === "Expired" && jobStatus === "skaduar");

      if (!matchesStatus) return false;

      const matchesSearch =
        shpallja?.pozitaPunes?.toLowerCase().includes(kerko?.toLowerCase()) ||
        shpallja?.kategoriaPunes
          ?.toLowerCase()
          .includes(kerko?.toLowerCase()) ||
        shpallja?.lokacioniPunes
          ?.toLowerCase()
          .includes(kerko?.toLowerCase()) ||
        aplikimi?.emriAplikantit
          ?.toLowerCase()
          .includes(kerko?.toLowerCase()) ||
        aplikimi?.emailAplikantit?.toLowerCase().includes(kerko?.toLowerCase());

      return matchesSearch;
    }),
  );

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Menaxho Aplikimet
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Menaxho dhe modifiko aplikimet e tua për pozita pune
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
                placeholder="Kërko aplikime..."
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
                  <th className="tableHead">Data e Aplikimit</th>
                  <th className="tableHead">Lokacioni</th>
                  <th className="tableHead text-center ">Orari</th>
                  <th className="tableHead">Statusi</th>
                  {filtrimiFaqes === "Active" && (
                    <th className="tableHead text-right">Veprime</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((aplikimi) => {
                  const shpallja = shpalljaData.find(
                    (sh) => sh._id === aplikimi.shpalljaId,
                  );
                  return (
                    <tr key={aplikimi._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {shpallja?.pozitaPunes || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shpallja?.kategoriaPunes || "N/A"}
                        </div>
                      </td>
                      <td className="tableData text-gray-500">
                        {new Date(aplikimi.dataKrijimit).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="tableData">
                        {shpallja?.lokacioniPunes || "N/A"}
                      </td>
                      <td className="tableData">
                        <span className="py-1 w-full items-center justify-center inline-flex text-sm font-medium">
                          {shpallja?.orari || "N/A"}
                        </span>
                      </td>
                      <td className="tableData">
                        {/* TODO: Statusin Ne pritje apo Refuzuar */}
                        <span className="px-1 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Në pritje
                        </span>
                      </td>
                      {filtrimiFaqes === "Active" && (
                        <td className="tableData text-right">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShfaqMeny(
                                  shfaqMeny === aplikimi._id
                                    ? null
                                    : aplikimi._id,
                                )
                              }
                              className="text-gray-400 hover:text-gray-600 p-2"
                            >
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>

                            {shfaqMeny === aplikimi._id && (
                              <div className="absolute right-6 top-0 max-w-48 bg-white rounded-lg shadow-lg border border-gray-200  z-10">
                                <button
                                  onClick={() => {
                                    setAplikimiKlikuar(aplikimi);
                                    setShfaqMeny(null);
                                  }}
                                  className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                                >
                                  <FontAwesomeIcon
                                    icon={faPencil}
                                    className="text-sm"
                                  />
                                  <span>Modifiko</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pjesa e mobile responsive*/}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredData.map((aplikimi) => {
              const shpallja = shpalljaData.find(
                (sh) => sh._id === aplikimi.shpalljaId,
              );
              return (
                <div key={aplikimi._id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-base font-medium text-gray-900 mb-1">
                        {shpallja?.pozitaPunes || "N/A"}
                      </div>
                      <div className="tableInfo mb-2">
                        {shpallja?.kategoriaPunes || "N/A"}
                      </div>

                      <div className="space-y-2">
                        <div className="tableInfo">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {new Date(aplikimi.dataKrijimit).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>

                        <div className="tableInfo">
                          <MapPin size={14} className="mr-2 text-gray-400" />
                          {shpallja?.lokacioniPunes || "N/A"}
                        </div>

                        <div className="tableInfo">
                          <Building size={14} className="mr-2 text-gray-400" />
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {shpallja?.orari || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative ml-2">
                      <button
                        onClick={() =>
                          setShfaqMeny(
                            shfaqMeny === aplikimi._id ? null : aplikimi._id,
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 p-2"
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>

                      {shfaqMeny === aplikimi._id && (
                        <div className="absolute right-6 top-0 max-w-48 bg-white rounded-lg shadow-lg border border-gray-200  z-10">
                          <button
                            onClick={() => {
                              setAplikimiKlikuar(aplikimi);
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
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Në pritje
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nuk ka aplikime për të shfaqur
            </div>
          )}
        </div>
      </div>

      {aplikimiKlikuar && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-fit overflow-y-auto shadow-xl">
            <div className="bg-[#f8f8f9] p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Modifiko Aplikimin</h2>
              <button
                onClick={() => setAplikimiKlikuar(null)}
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
                      htmlFor="emriAplikantit"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Emri
                    </label>
                    <input
                      id="emriAplikantit"
                      type="text"
                      value={aplikimiKlikuar.emriAplikantit}
                      onChange={modifikoAplikimin}
                      className="input-ShpalljaProfil"
                      placeholder="Sheno Emrin"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mbiemriAplikantit"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Mbiemri
                    </label>
                    <input
                      id="mbiemriAplikantit"
                      type="text"
                      value={aplikimiKlikuar.mbiemriAplikantit || ""}
                      onChange={modifikoAplikimin}
                      className="input-ShpalljaProfil"
                      placeholder="Sheno Mbiemrin"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="emailAplikantit"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="emailAplikantit"
                    type="email"
                    value={aplikimiKlikuar.emailAplikantit || ""}
                    onChange={modifikoAplikimin}
                    className="input-ShpalljaProfil"
                    placeholder="email@shembull.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="nrTelefonit"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Nr. Telefonit
                  </label>
                  <input
                    id="nrTelefonit"
                    type="text"
                    value={aplikimiKlikuar.nrTelefonit || ""}
                    onChange={modifikoAplikimin}
                    className="input-ShpalljaProfil"
                    placeholder="+383 XX XXX XXX"
                  />
                </div>

                <div>
                  <label
                    htmlFor="eksperienca"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Eksperienca
                  </label>
                  <input
                    id="eksperienca"
                    type="text"
                    value={aplikimiKlikuar.eksperienca || ""}
                    onChange={modifikoAplikimin}
                    className="input-ShpalljaProfil"
                    placeholder="3 vjet"
                  />
                </div>

                <div>
                  <label
                    htmlFor="letraMotivuese"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    Letra Motivuese
                  </label>
                  <textarea
                    id="letraMotivuese"
                    value={aplikimiKlikuar.letraMotivuese || ""}
                    onChange={modifikoAplikimin}
                    rows="5"
                    className="input-ShpalljaProfil"
                    placeholder="Shkruaj letrën motivuese..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 w-full">
                  <button
                    type="submit"
                    className="publikoPune cursor-pointer w-full"
                  >
                    Perfundo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenaxhoAplikimet;
