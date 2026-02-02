import { useState, useEffect, useRef } from "react";
import "../index.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
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

function ProfiliKompanise() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [kompaniaData, setKompaniaData] = useState({});
  const [linkeSociale, setLinkeSociale] = useState([]);
  const [shfaqLinkeForm, setShfaqLinkeForm] = useState(false);
  const [puneHapura, setPuneHapura] = useState([]);
  const [shfaqFormenPuneHapura, setShfaqFormenPuneHapura] = useState(false);

  // Photo upload states
  const [fotoProfile, setFotoProfile] = useState(null);
  const [poNgarkohetFoto, setPoNgarkohetFoto] = useState(false);
  const inputFotoRef = useRef(null);

  // Edit mode states
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/kompania/${id}`,
        );
        setKompaniaData(response.data.data);
        setRrethKompanise(response.data.data.rrethKompanise || "");
        setPermbledhje({
          kategorite: response.data.data.kategorite || "",
          numriTelefonit: response.data.data.numriTelefonit || "",
          dataThemelimit: response.data.data.dataThemelimit || "",
          emailAdresa: response.data.data.emailAdresa || "",
          vendodhja: response.data.data.vendodhja || "",
        });

        // Ngarko foton e profile nese ekziston
        if (response.data.data.foto) {
          setFotoProfile(`http://localhost:3000/api/kompania/${id}/foto`);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleCkycja = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/ckycja/kompania",
        {},
      );
      setKompaniaData(null);
      console.log("Ckycja u be", response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setKompaniaData(null);
    }
  };

  const merreShkronjatFillestare = () => {
    if (kompaniaData?.emri) {
      return kompaniaData.emri.substring(0, 2).toUpperCase();
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
      alert("Vetëm fotot janë të lejuara (JPEG, PNG, WEBP, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Madhësia e fotos është shumë e madhe. Maksimumi 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("photoFile", file);

    setPoNgarkohetFoto(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/kompania/${id}/ngarko-foto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setFotoProfile(
          `http://localhost:3000/api/kompania/${id}/foto?t=${Date.now()}`,
        );
        alert("Fotoja u ngarkua me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gabim në ngarkimin e fotos");
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
        `http://localhost:3000/api/kompania/${id}/foto`,
      );

      if (response.data.success) {
        setFotoProfile(null);
        alert("Fotoja u fshi me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në fshirjen e fotos");
    }
  };

  // Linki i ri
  const [linkRi, setLinkRi] = useState({
    platforma: "",
    url: "",
  });

  const handleShtoLink = () => {
    if (linkRi.platforma && linkRi.url) {
      setLinkeSociale([...linkeSociale, { ...linkRi, id: Date.now() }]);
      setLinkRi({
        platforma: "",
        url: "",
      });
      setShfaqLinkeForm(false);
    }
  };

  const handleFshijLinkin = (id) => {
    setLinkeSociale(linkeSociale.filter((link) => link.id !== id));
  };

  // Puna e re e hapur
  const [puneRe, setPuneRe] = useState({
    titulli: "",
    lloji: "",
    lokacioni: "",
    pershkrimi: "",
    kualifikimet: "",
    dataPublikimit: "",
  });

  const handleShtoPune = () => {
    if (puneRe.titulli && puneRe.lloji) {
      setPuneHapura([...puneHapura, { ...puneRe, id: Date.now() }]);
      setPuneRe({
        titulli: "",
        lloji: "",
        lokacioni: "",
        pershkrimi: "",
        kualifikimet: "",
        dataPublikimit: "",
      });
      setShfaqFormenPuneHapura(false);
    }
  };

  const handleFshijPune = (id) => {
    setPuneHapura(puneHapura.filter((pune) => pune.id !== id));
  };

  // Save edits
  const handleRuajRrethKompanise = async () => {
    try {
      await axios.put(`http://localhost:3000/api/kompania/${id}`, {
        rrethKompanise,
      });
      setEditMode({ ...editMode, rrethKompanise: false });
      alert("Përditësuar me sukses!");
    } catch (error) {
      console.error(error);
      alert("Gabim në përditësim");
    }
  };

  const handleRuajPermbledhje = async () => {
    try {
      await axios.put(`http://localhost:3000/api/kompania/${id}`, {
        ...permbledhje,
      });
      setEditMode({ ...editMode, permbledhje: false });
      alert("Përditësuar me sukses!");
    } catch (error) {
      console.error(error);
      alert("Gabim në përditësim");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header perdoruesiData={kompaniaData} onCkycja={handleCkycja} />

      <div className="max-w-4xl mx-auto mb-2 mt-10">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-2">
          <div className="h-32 bg-gradient-to-r">
            <div className="flex justify-end p-10 gap-2">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200">
                <Edit2 size={20} className="text-white" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <Upload size={18} />
                Publiko Punë
              </button>
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              {/* Logo Profile */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold shadow-xl border-4 border-white overflow-hidden">
                  {fotoProfile ? (
                    <img
                      src={fotoProfile}
                      alt="Logo Kompania"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={48} />
                  )}
                </div>

                <div className="absolute bottom-0 right-0 flex gap-1">
                  <button
                    onClick={() => inputFotoRef.current?.click()}
                    disabled={poNgarkohetFoto}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-200 disabled:bg-gray-400"
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
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-200"
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

              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h1 className="text-left text-3xl font-bold mb-1 text-gray-900">
                  {kompaniaData?.emri || "Emri i Kompanisë"}
                </h1>
                <div className="space-y-2 mt-4">
                  <p className="paragrafProfili">
                    <Mail size={16} />
                    {kompaniaData.email || "email@kompania.com"}
                  </p>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Linjet e rrjeteve sociale:</p>
                    <div className="flex flex-wrap gap-2">
                      {linkeSociale.map((link) => (
                        <div key={link.id} className="group relative">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                          >
                            <Link size={14} />
                            {link.platforma}
                          </a>
                          <button
                            onClick={() => handleFshijLinkin(link.id)}
                            className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setShfaqLinkeForm(!shfaqLinkeForm)}
                        className="inline-flex items-center gap-1 px-3 py-1 border-2 border-dashed border-gray-300 text-gray-600 rounded-full text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <Plus size={14} />
                        Shto Link
                      </button>
                    </div>

                    {shfaqLinkeForm && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Platforma (p.sh. LinkedIn, Facebook)"
                            value={linkRi.platforma}
                            onChange={(e) =>
                              setLinkRi({
                                ...linkRi,
                                platforma: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <input
                            type="url"
                            placeholder="URL"
                            value={linkRi.url}
                            onChange={(e) =>
                              setLinkRi({ ...linkRi, url: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleShtoLink}
                              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                              Ruaj
                            </button>
                            <button
                              onClick={() => setShfaqLinkeForm(false)}
                              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                            >
                              Anulo
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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

            {shfaqFormenPuneHapura && (
              <div className="px-6 py-4 bg-gray-50 mb-5 rounded-lg">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Titulli i pozicionit"
                    value={puneRe.titulli}
                    onChange={(e) =>
                      setPuneRe({ ...puneRe, titulli: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Lloji (p.sh. Full-time, Part-time)"
                      value={puneRe.lloji}
                      onChange={(e) =>
                        setPuneRe({ ...puneRe, lloji: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Lokacioni"
                      value={puneRe.lokacioni}
                      onChange={(e) =>
                        setPuneRe({ ...puneRe, lokacioni: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    placeholder="Përshkrimi i punës"
                    value={puneRe.pershkrimi}
                    onChange={(e) =>
                      setPuneRe({ ...puneRe, pershkrimi: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <textarea
                    placeholder="Kualifikimet e nevojshme"
                    value={puneRe.kualifikimet}
                    onChange={(e) =>
                      setPuneRe({ ...puneRe, kualifikimet: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleShtoPune} className="publikoPune">
                      Publiko
                    </button>
                    <button
                      onClick={() => setShfaqFormenPuneHapura(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Anulo
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4">
              {puneHapura.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nuk ka pozicione të hapura aktualisht
                </p>
              ) : (
                <div className="space-y-4">
                  {puneHapura.map((pune) => (
                    <div
                      key={pune.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative group"
                    >
                      <button
                        onClick={() => handleFshijPune(pune.id)}
                        className="absolute top-4 right-4 p-1 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={18} />
                      </button>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {pune.titulli}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {pune.lloji}
                        </span>
                        {pune.lokacioni && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                            <MapPin size={14} />
                            {pune.lokacioni}
                          </span>
                        )}
                      </div>
                      {pune.pershkrimi && (
                        <p className="text-gray-600 mb-2">{pune.pershkrimi}</p>
                      )}
                      {pune.kualifikimet && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">
                            Kualifikimet:
                          </p>
                          <p className="text-sm text-gray-600">
                            {pune.kualifikimet}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                {rrethKompanise || "Nuk ka informacione të shtuar akoma."}
              </p>
            )}
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Përmbledhje */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Përmbledhje
              </h2>
              {!editMode.permbledhje ? (
                <button
                  onClick={() =>
                    setEditMode({ ...editMode, permbledhje: true })
                  }
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Edit2 size={18} />
                  <span className="text-sm">Ndrysho</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleRuajPermbledhje}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  >
                    Ruaj
                  </button>
                  <button
                    onClick={() =>
                      setEditMode({ ...editMode, permbledhje: false })
                    }
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Anulo
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Kategoritë */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Briefcase className="text-blue-500" size={18} />
                    Kategoritë:
                  </label>
                  {editMode.permbledhje ? (
                    <input
                      type="text"
                      value={permbledhje.kategorite}
                      onChange={(e) =>
                        setPermbledhje({
                          ...permbledhje,
                          kategorite: e.target.value,
                        })
                      }
                      placeholder="p.sh. Teknologji, Shërbime"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-600 pl-4">
                      {permbledhje.kategorite || "Nuk është specifikuar"}
                    </p>
                  )}
                </div>

                {/* Data e themelimit */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Calendar className="text-blue-500" size={18} />
                    Data e themelimit:
                  </label>
                  {editMode.permbledhje ? (
                    <input
                      type="date"
                      value={permbledhje.dataThemelimit}
                      onChange={(e) =>
                        setPermbledhje({
                          ...permbledhje,
                          dataThemelimit: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-600 pl-4">
                      {permbledhje.dataThemelimit || "Nuk është specifikuar"}
                    </p>
                  )}
                </div>

                {/* Vendodhja */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MapPin className="text-blue-500" size={18} />
                    Vendodhja:
                  </label>
                  {editMode.permbledhje ? (
                    <input
                      type="text"
                      value={permbledhje.vendodhja}
                      onChange={(e) =>
                        setPermbledhje({
                          ...permbledhje,
                          vendodhja: e.target.value,
                        })
                      }
                      placeholder="p.sh. Prishtinë, Kosovë"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-600 pl-4">
                      {permbledhje.vendodhja || "Nuk është specifikuar"}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Numri i telefonit */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Phone className="text-blue-500" size={18} />
                    Numri i telefonit:
                  </label>
                  {editMode.permbledhje ? (
                    <input
                      type="tel"
                      value={permbledhje.numriTelefonit}
                      onChange={(e) =>
                        setPermbledhje({
                          ...permbledhje,
                          numriTelefonit: e.target.value,
                        })
                      }
                      placeholder="+383 XX XXX XXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-600 pl-4">
                      {permbledhje.numriTelefonit || "Nuk është specifikuar"}
                    </p>
                  )}
                </div>

                {/* E-mail adresa */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Mail className="text-blue-500" size={18} />
                    E-mail adresa:
                  </label>
                  {editMode.permbledhje ? (
                    <input
                      type="email"
                      value={permbledhje.emailAdresa}
                      onChange={(e) =>
                        setPermbledhje({
                          ...permbledhje,
                          emailAdresa: e.target.value,
                        })
                      }
                      placeholder="info@kompania.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-600 pl-4">
                      {permbledhje.emailAdresa || "Nuk është specifikuar"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-lg mt-2 p-6 text-center">
          <p className="text-gray-600">
            Përditësuar më: {new Date().toLocaleDateString("sq-AL")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfiliKompanise;