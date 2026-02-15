import { useState, useEffect, useRef } from "react";
import "../index.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Phone,
  Plus,
  Edit2,
  Upload,
  Link,
  X,
  Camera,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
} from "lucide-react";
import Perdoruesi from "../PerdoruesiContext";
import { useAlert } from "../contexts/AlertContext";

function ProfiliKompanise() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { id } = useParams();
  const { perdoruesiData, setPerdoruesiData } = Perdoruesi.usePerdoruesi();
  const [shfaqLinkeForm, setShfaqLinkeForm] = useState(false);
  const [puneHapura, setPuneHapura] = useState([]);
  const [fotoProfile, setFotoProfile] = useState(null);
  const [poNgarkohetFoto, setPoNgarkohetFoto] = useState(false);
  const inputFotoRef = useRef(null);
  const [editKompaniaMode, setEditKompaniaMode] = useState(false);
  const [newKompaniaData, setNewKompaniaData] = useState({
    kompania: "",
    nrTelefonit: "",
  });

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/shpallja/kompania/im",
        );
        if (response.data.success) {
          setPuneHapura(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployerJobs();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profili/${id}`,
        );
        if (response.data.success) {
          setPerdoruesiData(response.data.data);
        }

        // Ngarko foton e profile nese ekziston
        if (response.data.data.foto) {
          setFotoProfile(`http://localhost:3000/api/profili/${id}/foto`);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const merreShkronjatFillestare = () => {
    if (perdoruesiData?.kompania) {
      return perdoruesiData.kompania.substring(0, 2).toUpperCase();
    }
    return "KO";
  };

  // Menaxho ngarkimin e fotos
  const handleNgarkoFoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const llojetELejuara = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!llojetELejuara.includes(file.type)) {
      showAlert("Vetëm fotot janë të lejuara (JPEG, PNG, WEBP, GIF)", "info");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Madhësia e fotos është shumë e madhe. Maksimumi 5MB", "info");
      return;
    }

    const formData = new FormData();
    formData.append("photoFile", file);

    setPoNgarkohetFoto(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/profili/${id}/ngarko-foto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setFotoProfile(
          `http://localhost:3000/api/profili/${id}/foto?t=${Date.now()}`,
        );
        showAlert("Fotoja u ngarkua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert(
        error.response?.data?.message || "Gabim në ngarkimin e fotos",
        "error",
      );
    } finally {
      setPoNgarkohetFoto(false);
    }
  };

  const handleFshijFoto = async () => {
    if (!window.confirm("Jeni të sigurt që dëshironi të fshini foton?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/profili/${id}/foto`,
      );

      if (response.data.success) {
        setFotoProfile(null);
        showAlert("Fotoja u fshi me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në fshirjen e fotos", "error");
    }
  };

  const [editMode, setEditMode] = useState({
    rrethKompanise: false,
    permbledhje: false,
  });

  // Editable data
  const [rrethKompanise, setRrethKompanise] = useState("");
  const [permbledhje, setPermbledhje] = useState({
    kategorite: "",
    numriTelefonit: "",
    dataThemelimit: "",
    emailAdresa: "",
    vendodhja: "",
  });

  const handleSaveKompania = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          kompania: newKompaniaData.kompania,
          nrTelefonit: newKompaniaData.nrTelefonit,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setEditKompaniaMode(false);
        showAlert("U përditësua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim gjatë përditësimit", "error");
    }
  };

  const [linkRi, setLinkRi] = useState({
    platforma: "",
    linku: "",
  });

  const handleShtoLink = async () => {
    if (!linkRi.platforma || !linkRi.linku) {
      showAlert("Ju lutem plotësoni të dyja fushat", "info");
      return;
    }

    try {
      const newLink = {
        platforma: linkRi.platforma,
        linku: linkRi.linku,
      };

      const updatedLinks = [...(perdoruesiData?.linqet || []), newLink];

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          linqet: updatedLinks,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setLinkRi({
          platforma: "",
          linku: "",
        });
        setShfaqLinkeForm(false);
        showAlert("Linku u shtua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në ruajtjen e linkut", "error");
    }
  };

  const handleFshijLinkin = async (index) => {
    if (!window.confirm("Jeni të sigurt që dëshironi ta fshini këtë link?")) {
      return;
    }

    try {
      const updatedLinks = (perdoruesiData?.linqet || []).filter(
        (_, i) => i !== index,
      );

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          linqet: updatedLinks,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        showAlert("Linku u fshi me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në fshirjen e linkut", "error");
    }
  };
  const handleRuajRrethKompanise = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          rrethKompanise,
        },
      );
      if (response.data.success) {
        setPerdoruesiData((prev) => ({
          ...prev,
          ...response.data.data, // may contain { rrethKompanise }
          rrethKompanise, // or just set it directly
        }));
        setEditMode({ ...editMode, rrethKompanise: false });
        showAlert("Përditësuar me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në përditësim", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-2 mt-10">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg mb-6 p-8">
        {/* Top Right Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/publikopune")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
          >
            <Upload size={18} />
            Publiko Punë
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-8">
          {/* Logo / Profile Picture */}
          <div className="relative group flex-shrink-0 self-center sm:self-start">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-gray-400 text-4xl font-bold shadow-xl border overflow-hidden">
              {fotoProfile ? (
                <img
                  src={fotoProfile}
                  alt="Logo Kompania"
                  className="w-full h-full object-cover"
                />
              ) : (
                merreShkronjatFillestare()
              )}
            </div>

            <div className="absolute bottom-0 right-0 flex gap-1">
              <button
                onClick={() => inputFotoRef.current?.click()}
                disabled={poNgarkohetFoto}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all disabled:bg-gray-400"
                title="Ngarko logo"
              >
                {poNgarkohetFoto ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera size={18} />
                )}
              </button>

              {fotoProfile && (
                <button
                  onClick={handleFshijFoto}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
                  title="Fshi logo"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <input
              ref={inputFotoRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleNgarkoFoto}
              className="hidden"
            />
          </div>

          {/* Company Info */}
          <div className="flex-1 text-center sm:text-left">
            {editKompaniaMode ? (
              <form onSubmit={handleSaveKompania} className="space-y-4">
                <input
                  type="text"
                  value={newKompaniaData.kompania}
                  onChange={(e) =>
                    setNewKompaniaData({
                      ...newKompaniaData,
                      kompania: e.target.value,
                    })
                  }
                  placeholder="Emri i kompanisë"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <p className="paragrafProfili">
                  <Mail size={16} />
                  {perdoruesiData?.email || "email@kompania.com"}
                </p>

                <input
                  type="text"
                  value={newKompaniaData.nrTelefonit}
                  onChange={(e) =>
                    setNewKompaniaData({
                      ...newKompaniaData,
                      nrTelefonit: e.target.value,
                    })
                  }
                  placeholder="Numri i telefonit"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition"
                  >
                    Ruaj
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditKompaniaMode(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition"
                  >
                    Anulo
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {perdoruesiData?.kompania || "Emri i Kompanisë"}
                  </h1>

                  <button
                    onClick={() => {
                      setNewKompaniaData({
                        kompania: perdoruesiData?.kompania || "",
                        nrTelefonit:
                          perdoruesiData?.nrTelefonit?.toString() || "",
                      });
                      setEditKompaniaMode(true);
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Edit2 size={20} className="text-gray-600" />
                  </button>
                </div>

                <div className="space-y-2 mt-4">
                  <p className="paragrafProfili">
                    <Mail size={16} />
                    {perdoruesiData?.email || "email@kompania.com"}
                  </p>

                  {perdoruesiData?.nrTelefonit && (
                    <p className="paragrafProfili">
                      <Phone size={16} />
                      {perdoruesiData.nrTelefonit}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
        {/* Punë të Hapura */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                Punë të Hapura
              </h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {puneHapura.length} Pozicione
              </span>
            </div>
          </div>

          <div className="px-6 py-4">
            {puneHapura.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nuk ka pozicione të hapura aktualisht
              </p>
            ) : (
              <div className="space-y-4">
                {puneHapura.slice(0, 2).map((pune) => (
                  <div
                    key={pune.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative group"
                    onClick={() => navigate(`/shpallja/${pune._id}`)}
                  >
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {pune.pozitaPunes}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {pune.kategoriaPunes}
                      </span>
                      {pune.lokacioniPunes && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                          <MapPin size={14} />
                          {pune.lokacioniPunes}
                        </span>
                      )}
                    </div>
                    {(pune.aftesitePrimare || pune.aftesiteSekondare) && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 inline">
                          Aftesite e Kerkuara:{" "}
                        </p>
                        {pune.aftesitePrimare.map((ap) => {
                          return (
                            <p className="text-sm text-gray-600 inline">
                              {ap}{" "}
                            </p>
                          );
                        })}
                        {pune.aftesiteSekondare.map((as) => {
                          return (
                            <p className="text-sm text-gray-600 inline">
                              {as}{" "}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() =>
              navigate(`/profili/${perdoruesiData?._id}/menaxhoShpalljet`)
            }
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Menaxho Te Gjitha Shpalljet →
          </button>
        </div>

        <hr className="border-gray-200 my-8" />

        {/* Rreth Kompanisë */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Rreth Kompanisë
            </h2>
            {!editMode.rrethKompanise ? (
              <button
                onClick={() =>
                  setEditMode({ ...editMode, rrethKompanise: true })
                }
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <Edit2 size={18} />
                <span className="text-sm">Ndrysho</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleRuajRrethKompanise}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Ruaj
                </button>
                <button
                  onClick={() =>
                    setEditMode({ ...editMode, rrethKompanise: false })
                  }
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Anulo
                </button>
              </div>
            )}
          </div>
          {editMode.rrethKompanise ? (
            <textarea
              value={rrethKompanise}
              onChange={(e) => setRrethKompanise(e.target.value)}
              placeholder="Shkruani rreth kompanisë..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {perdoruesiData?.rrethKompanise ||
                "Nuk ka informacione të shtuar akoma."}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-2xl shadow-lg mt-2 p-6 text-center">
        <p className="text-gray-600">
          Përditësuar më: {new Date().toLocaleDateString("sq-AL")}
        </p>
      </div>
    </div>
  );
}

export default ProfiliKompanise;
