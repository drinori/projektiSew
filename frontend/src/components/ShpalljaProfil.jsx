import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import { faX } from "@fortawesome/free-solid-svg-icons";

function ShpalljaProfil() {
  const [perdoruesiData, setPerdoruesiData] = useState({});
  const [shpalljaData, setShpalljaData] = useState([]);
  const [shpalljaKlikuarId, setShpalljaKlikuarId] = useState(false);
  const [shpalljaKlikuar, setShpalljaKlikuar] = useState(null);
  const [aplikimet, setAplikimet] = useState([]);
  const [aplikimiKlikuar, setAplikimiKlikuar] = useState(null);
  const [shfaqPopupAplikanteve, setShfaqPopupAplikanteve] = useState(null);
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
    console.log("perdoruesi: ", perdoruesiData);
  }, [perdoruesiData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/shpallja/kompania",
        );
        if (Array.isArray(response.data.data)) {
          const shpalljetFiltruara = response.data.data.filter((shpallja) => {
            return shpallja.emailKompanise === perdoruesiData.email;
          });

          if (shpalljetFiltruara.length > 0) {
            setShpalljaData(shpalljetFiltruara);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [perdoruesiData]);

  useEffect(() => {
    const fetchData = async () => {
      if (!shpalljaKlikuarId && !shpalljaZgjedhurPerAplikante) {
        setAplikimet([]);
        return;
      }

      const jobId = shpalljaKlikuarId || shpalljaZgjedhurPerAplikante?._id;
      if (!jobId) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/shpallja/${jobId}/aplikimet`,
        );

        if (response.data.success) {
          setAplikimet(response.data.aplikimet);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [shpalljaKlikuarId, shpalljaZgjedhurPerAplikante]);

  useEffect(() => {
    console.log("shpallja: ", shpalljaData);
  }, [shpalljaData]);

  if (!perdoruesiData) {
    return (
      <div>
        <Header />
        <div className="text-center p-10">
          <p>Diqka shkoi keq!</p>
        </div>
      </div>
    );
  }

  const hapShpalljen = (shpallja) => {
    setShfaqPopupAplikanteve(false); // mshel window e qelt
    setAplikimiKlikuar(null); // mshel window e qelt
    setShpalljaKlikuarId(shpallja._id);
    setShpalljaKlikuar(shpallja);
  };

  const shfaqAplikantPopup = (e, shpallja) => {
    e.stopPropagation();
    setShpalljaKlikuar(null); // mshel window e qelt
    setAplikimiKlikuar(null); // mshel window e qelt
    setShpalljaZgjedhurPerAplikante(shpallja);
    setShfaqPopupAplikanteve(true);
  };

  const mbyllAplikantPopup = () => {
    setShfaqPopupAplikanteve(null);
    setShpalljaZgjedhurPerAplikante(null);
    setAplikimiKlikuar(null);
  };

  const modifikoShpalljen = (e) => {
    const { id, value } = e.target;
    setShpalljaKlikuar({
      ...shpalljaKlikuar,
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

  const hapAplikimin = async (aplikimi) => {
    setShpalljaKlikuar(null); // mbyll window
    setShfaqPopupAplikanteve(false); //mbyll window
    setAplikimiKlikuar(aplikimi);
  };

  return (
    <div>
      {shpalljaData.map((sh) => {
        return (
          <div className="" key={sh._id}>
            <div className="border border-gray-200 rounded-2xl">
              <div className="grid grid-cols-1 min-[370px]:grid-cols-2 items-center px-6 my-6">
                <h1 className="text-base sm:text-lg min-[md]:text-xl min-[lg]:text-2xl font-medium truncate">
                  {sh.pozitaPunes}
                </h1>

                <div className="min-[370px]:justify-self-end">
                  <button
                    className="border border-gray-200 px-4 py-2 rounded-lg cursor-pointer"
                    type="button"
                    onClick={() => hapShpalljen(sh)}
                  >
                    Detajet
                  </button>
                </div>
              </div>

              <div className="border border-[#f8f8f9] bg-[#f8f8f9] rounded-2xl p-4 md:p-6 m-2">
                <div className="grid min-[365px]:grid-cols-2 min-[434px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  <p className="flex items-center gap-2">
                    <span>📍</span>
                    {sh.lokacioniPunes}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>💼</span>
                    {sh.niveliPunes}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>⏳</span>
                    {sh.llojiPunesimit}
                  </p>
                  <div className="grid col-span-2 text-sm text-gray-500 ">
                    Publikuar{" "}
                    {new Date(sh.dataKrijimit).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {sh.numriAplikimeve} aplikant
                  </p>
                </div>
              </div>

              <div className="py-4 md:py-6 px-2">
                <button
                  className="w-full border border-gray-200 p-3 md:p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={(e) => shfaqAplikantPopup(e, sh)}
                >
                  Aplikantet
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {shpalljaKlikuar && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-fit overflow-y-auto shadow-xl">
            <div className="bg-[#f8f8f9] p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Modifiko Shpalljen</h2>
              <FontAwesomeIcon
                icon={faX}
                className="cursor-pointer text-xl hover:text-gray-700"
                onClick={() => setShpalljaKlikuar(null)}
              />
            </div>

            <div className="p-6">
              <form onSubmit={ruajNdryshimet} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
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
                      value={shpalljaKlikuar.pozitaPunes || ""}
                      onChange={modifikoShpalljen}
                      className="w-full py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg font-semibold"
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
                      className="w-full py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg font-semibold"
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
                    className="w-full py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    placeholder="Looking for an experienced full stack developer..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="bg-[#f8f8f9] p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold">
                Aplikimet për {shpalljaZgjedhurPerAplikante.pozitaPunes}
              </h2>
              <FontAwesomeIcon
                icon={faX}
                className="cursor-pointer text-xl hover:text-gray-700"
                onClick={mbyllAplikantPopup}
              />
            </div>

            <div className="p-6">
              <h4 className="font-bold mb-4 text-lg">
                Total Aplikimet: {aplikimet.length}
              </h4>

              {aplikimet.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nuk ka aplikime për këtë pozitë
                </p>
              ) : (
                <div className="space-y-3">
                  {aplikimet.map((a) => (
                    <div
                      key={a._id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-lg">
                            {a.emriAplikantit} {a.mbiemriAplikantit}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {a.emailAplikantit}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="publikoPune ml-4"
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
        <div className="fixed inset-0 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg w-11/12 max-w-xl shadow-xl">
            <div className="bg-[#f8f8f9] p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Detajet e Aplikantit</h2>
              <FontAwesomeIcon
                icon={faX}
                className="cursor-pointer text-xl hover:text-gray-700"
                onClick={() => setAplikimiKlikuar(null)}
              />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Emri</p>
                <p className="text-lg font-medium">
                  {aplikimiKlikuar.emriAplikantit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mbiemri</p>
                <p className="text-lg font-medium">
                  {aplikimiKlikuar.mbiemriAplikantit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium">
                  {aplikimiKlikuar.emailAplikantit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Eksperienca</p>
                <p className="text-lg font-medium">N/A</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Niveli</p>
                <p className="text-lg font-medium">N/A</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShpalljaProfil;
