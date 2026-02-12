import { useState, useEffect, useRef } from "react";
import "../index.css";
import { useParams } from "react-router-dom";
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
} from "lucide-react";
import Perdoruesi from "../PerdoruesiContext";

function ProfiliAplikantit() {
  const { perdoruesiData, setPerdoruesiData } = Perdoruesi.usePerdoruesi();
  const { id } = useParams();

  const [shfaqLinkeForm, setShfaqLinkeForm] = useState(false);
  const [shfaqFormenEksperienca, setShfaqFormenEksperienca] = useState(false);
  const [shfaqFormenEdukimi, setShfaqFormenEdukimi] = useState(false);
  const [shfaqFormenProjektet, setShfaqFormenProjektet] = useState(false);
  const [shfaqFormenAftesite, setShfaqFormenAftesite] = useState(false);
  const [aftesiRe, setAftesiRe] = useState("");

  const [fotoProfile, setFotoProfile] = useState(null);
  const [poNgarkohetFoto, setPoNgarkohetFoto] = useState(false);
  const inputFotoRef = useRef(null);

  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profili/${id}`,
        );
        setPerdoruesiData(response.data.data);

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
    if (perdoruesiData?.emri && perdoruesiData?.mbiemri) {
      return `${perdoruesiData.emri[0]}${perdoruesiData.mbiemri[0]}`.toUpperCase();
    } else if (perdoruesiData?.kompania) {
      return perdoruesiData.kompania.substring(0, 2).toUpperCase();
    }
    return "?";
  };

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
        `http://localhost:3000/api/profili/${id}/foto`,
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

  const [linkRi, setLinkRi] = useState({
    platforma: "",
    linku: "",
  });

  const handleShtoLink = async () => {
    if (!linkRi.platforma || !linkRi.linku) {
      alert("Ju lutem plotësoni të dyja fushat");
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
        alert("Linku u shtua me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në ruajtjen e linkut");
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
        alert("Linku u fshi me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në fshirjen e linkut");
    }
  };

  // ========== EXPERIENCE SECTION ==========
  const [eksperienceRe, setEksperienceRe] = useState({
    titulli: "",
    kompania: "",
    dataFillimit: "",
    dataMbarimit: "",
    aktuale: false,
    pershkrimi: "",
  });

  const handleShtoEksperiencen = async () => {
    if (!eksperienceRe.titulli || !eksperienceRe.kompania) {
      alert("Ju lutem plotësoni të paktën titullin dhe kompaninë");
      return;
    }

    // Date validation
    if (eksperienceRe.dataFillimit && eksperienceRe.dataMbarimit) {
      const start = new Date(eksperienceRe.dataFillimit);
      const end = new Date(eksperienceRe.dataMbarimit);
      const today = new Date();

      if (end < start) {
        alert("Data e mbarimit nuk mund të jetë më herët se data e fillimit!");
        return;
      }

      if (start > today) {
        alert("Data e fillimit nuk mund të jetë në të ardhmen!");
        return;
      }

      if (end > today) {
        alert("Data e mbarimit nuk mund të jetë në të ardhmen!");
        return;
      }
    }

    try {
      const newExperience = {
        titulli: eksperienceRe.titulli,
        kompania: eksperienceRe.kompania,
        dataFillimit: eksperienceRe.dataFillimit,
        dataMbarimit: eksperienceRe.dataMbarimit || null,
        aktuale: eksperienceRe.aktuale || false,
        pershkrimi: eksperienceRe.pershkrimi || "",
      };

      const updatedExperiences = [
        ...(perdoruesiData?.eksperiencat || []),
        newExperience,
      ];

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          eksperiencat: updatedExperiences,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setEksperienceRe({
          titulli: "",
          kompania: "",
          dataFillimit: "",
          dataMbarimit: "",
          aktuale: false,
          pershkrimi: "",
        });
        setShfaqFormenEksperienca(false);
        alert("Eksperienca u shtua me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në ruajtjen e eksperiencës");
    }
  };

  const handleFshijEksperiencen = async (index) => {
    if (
      !window.confirm("Jeni të sigurt që dëshironi ta fshini këtë eksperiencë?")
    ) {
      return;
    }

    try {
      const updatedExperiences = (perdoruesiData?.eksperiencat || []).filter(
        (_, i) => i !== index,
      );

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          eksperiencat: updatedExperiences,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        alert("Eksperienca u fshi me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në fshirjen e eksperiencës");
    }
  };

  // ========== EDUCATION SECTION ==========
  const [edukimiRi, setEdukimiRi] = useState({
    titulli: "",
    institucioni: "",
    dataFillimit: "",
    dataMbarimit: "",
    aktuale: false,
    pershkrimi: "",
  });

  const handleShtoEdukimin = async () => {
    if (!edukimiRi.titulli || !edukimiRi.institucioni) {
      alert("Ju lutem plotësoni të paktën titullin dhe institucionin");
      return;
    }

    // Date validation
    if (edukimiRi.dataFillimit && edukimiRi.dataMbarimit) {
      const start = new Date(edukimiRi.dataFillimit);
      const end = new Date(edukimiRi.dataMbarimit);
      const today = new Date();

      if (end < start) {
        alert("Data e mbarimit nuk mund të jetë më herët se data e fillimit!");
        return;
      }

      if (start > today) {
        alert("Data e fillimit nuk mund të jetë në të ardhmen!");
        return;
      }

      if (end > today) {
        alert("Data e mbarimit nuk mund të jetë në të ardhmen!");
        return;
      }
    }

    try {
      const newEducation = {
        titulli: edukimiRi.titulli,
        institucioni: edukimiRi.institucioni,
        dataFillimit: edukimiRi.dataFillimit,
        dataMbarimit: edukimiRi.dataMbarimit || null,
        aktuale: edukimiRi.aktuale || false,
        pershkrimi: edukimiRi.pershkrimi || "",
      };

      const updatedEducation = [
        ...(perdoruesiData?.edukimi || []),
        newEducation,
      ];

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          edukimi: updatedEducation,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setEdukimiRi({
          titulli: "",
          institucioni: "",
          dataFillimit: "",
          dataMbarimit: "",
          aktuale: false,
          pershkrimi: "",
        });
        setShfaqFormenEdukimi(false);
        alert("Edukimi u shtua me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në ruajtjen e edukimit");
    }
  };

  const handleFshijEdukimin = async (index) => {
    if (!window.confirm("Jeni të sigurt që dëshironi ta fshini këtë edukim?")) {
      return;
    }

    try {
      const updatedEducation = (perdoruesiData?.edukimi || []).filter(
        (_, i) => i !== index,
      );

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          edukimi: updatedEducation,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        alert("Edukimi u fshi me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në fshirjen e edukimit");
    }
  };

  // ========== PROJECTS SECTION ==========
  const [projektRi, setProjektRi] = useState({
    emriProjektit: "",
    pershkrimi: "",
    teknologjite: "",
    linku: "",
  });

  const handleShtoProjekt = async () => {
    if (!projektRi.emriProjektit) {
      alert("Ju lutem plotësoni emrin e projektit");
      return;
    }

    try {
      const newProject = {
        emriProjektit: projektRi.emriProjektit,
        pershkrimi: projektRi.pershkrimi || "",
        teknologjite: projektRi.teknologjite || "",
        linku: projektRi.linku || "",
      };

      const updatedProjects = [
        ...(perdoruesiData?.projektet || []),
        newProject,
      ];

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          projektet: updatedProjects,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setProjektRi({
          emriProjektit: "",
          pershkrimi: "",
          teknologjite: "",
          linku: "",
        });
        setShfaqFormenProjektet(false);
        alert("Projekti u shtua me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në ruajtjen e projektit");
    }
  };

  const handleFshijProjektin = async (index) => {
    if (
      !window.confirm("Jeni të sigurt që dëshironi ta fshini këtë projekt?")
    ) {
      return;
    }

    try {
      const updatedProjects = (perdoruesiData?.projektet || []).filter(
        (_, i) => i !== index,
      );

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          projektet: updatedProjects,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        alert("Projekti u fshi me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në fshirjen e projektit");
    }
  };

  // ========== SKILLS (AFTËSITË) SECTION – CORRECTED FOR [String] SCHEMA ==========
  const handleShtoAftesine = async () => {
    if (!aftesiRe.trim()) {
      alert("Ju lutem shkruani emrin e aftësisë");
      return;
    }

    try {
      const updatedSkills = [
        ...(perdoruesiData?.aftesite || []),
        aftesiRe.trim(),
      ];

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          aftesite: updatedSkills,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setAftesiRe("");
        setShfaqFormenAftesite(false);
        alert("Aftësia u shtua me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në ruajtjen e aftësisë");
    }
  };

  const handleFshijAftesine = async (index) => {
    if (!window.confirm("Jeni të sigurt që dëshironi ta fshini këtë aftësi?")) {
      return;
    }

    try {
      const updatedSkills = (perdoruesiData?.aftesite || []).filter(
        (_, i) => i !== index,
      );

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        {
          aftesite: updatedSkills,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        alert("Aftësia u fshi me sukses!");
      }
    } catch (error) {
      console.error(error);
      alert("Gabim në fshirjen e aftësisë");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-2 mt-10">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-2">
        <div className="h-32 bg-white/30">
          <div className="flex justify-end p-10 gap-2">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <Edit2 size={20} className="text-gray-600" />
            </button>
            <button className="publikoPune flex items-center gap-2 px-4 py-2 ">
              <Upload size={18} />
              Ngarko CV
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
            {/* Profile Photo */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-black text-4xl font-bold shadow-xl border-4 border-blue-100 overflow-hidden">
                {fotoProfile ? (
                  <img
                    src={fotoProfile}
                    alt="Foto Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{merreShkronjatFillestare()}</span>
                )}
              </div>

              <div className="absolute bottom-0 right-0 flex gap-1">
                <button
                  onClick={() => inputFotoRef.current?.click()}
                  disabled={poNgarkohetFoto}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-200 disabled:bg-gray-400"
                  title="Ngarko foto"
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
                    title="Fshi foto"
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

            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1 relative">
              <h1 className="text-left text-3xl mb-1">
                {perdoruesiData?.emri || perdoruesiData?.kompania}{" "}
                {perdoruesiData?.mbiemri}
              </h1>
              <div className="space-y-2 mt-4">
                <p className="paragrafProfili">
                  <Mail size={16} />
                  {perdoruesiData?.email}
                </p>
                <p className="paragrafProfili">
                  <Phone size={16} />
                  {perdoruesiData?.nrTelefonit}
                </p>

                {/* Links Section */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {perdoruesiData?.linqet?.map((link, index) => (
                      <div key={index} className="group relative">
                        <a
                          href={link.linku}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                        >
                          <Link size={14} />
                          {link.platforma}
                        </a>
                        <button
                          onClick={() => handleFshijLinkin(index)}
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
                          placeholder="Platforma (p.sh. LinkedIn, GitHub)"
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
                          value={linkRi.linku}
                          onChange={(e) =>
                            setLinkRi({ ...linkRi, linku: e.target.value })
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
      <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-4xl mx-auto ">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
            {/* Experience Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Eksperienca
              </h2>
              <button
                onClick={() =>
                  setShfaqFormenEksperienca(!shfaqFormenEksperienca)
                }
                className="flex items-center gap-1"
              >
                <Plus
                  size={28}
                  className="hover:bg-gray-100 p-1 rounded-full"
                />
              </button>
            </div>

            {shfaqFormenEksperienca && (
              <div className="px-6 py-4 bg-gray-50 mt-5 mb-6 rounded-lg">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Titulli i pozicionit"
                    value={eksperienceRe.titulli}
                    onChange={(e) =>
                      setEksperienceRe({
                        ...eksperienceRe,
                        titulli: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Kompania"
                    value={eksperienceRe.kompania}
                    onChange={(e) =>
                      setEksperienceRe({
                        ...eksperienceRe,
                        kompania: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      placeholder="Data fillimit"
                      value={eksperienceRe.dataFillimit}
                      onChange={(e) =>
                        setEksperienceRe({
                          ...eksperienceRe,
                          dataFillimit: e.target.value,
                        })
                      }
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      placeholder="Data mbarimit"
                      value={eksperienceRe.dataMbarimit}
                      onChange={(e) =>
                        setEksperienceRe({
                          ...eksperienceRe,
                          dataMbarimit: e.target.value,
                        })
                      }
                      max={new Date().toISOString().split("T")[0]}
                      min={eksperienceRe.dataFillimit || ""}
                      disabled={eksperienceRe.aktuale}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        eksperienceRe.aktuale ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="aktuale"
                      checked={eksperienceRe.aktuale}
                      onChange={(e) =>
                        setEksperienceRe({
                          ...eksperienceRe,
                          aktuale: e.target.checked,
                          dataMbarimit: e.target.checked
                            ? ""
                            : eksperienceRe.dataMbarimit,
                        })
                      }
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label
                      htmlFor="aktuale"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Aktualisht punoj këtu
                    </label>
                  </div>
                  <textarea
                    placeholder="Përshkrimi"
                    value={eksperienceRe.pershkrimi}
                    onChange={(e) =>
                      setEksperienceRe({
                        ...eksperienceRe,
                        pershkrimi: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleShtoEksperiencen}
                      className="publikoPune"
                    >
                      Ruaj
                    </button>
                    <button
                      onClick={() => setShfaqFormenEksperienca(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Anulo
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4">
              {!perdoruesiData?.eksperiencat ||
              perdoruesiData.eksperiencat.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nuk ka përvoja të shtuara ende
                </p>
              ) : (
                <div className="space-y-4">
                  {perdoruesiData.eksperiencat.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-2 relative group hover:bg-gray-50 rounded-r-lg transition-colors"
                    >
                      <button
                        onClick={() => handleFshijEksperiencen(index)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={18} />
                      </button>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {exp.titulli}
                      </h3>
                      <p className="text-gray-700">{exp.kompania}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateDDMMYYYY(exp.dataFillimit)} -{" "}
                        {exp.aktuale
                          ? "Aktuale"
                          : formatDateDDMMYYYY(exp.dataMbarimit)}
                      </p>
                      {exp.pershkrimi && (
                        <p className="text-gray-600 mt-2">{exp.pershkrimi}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-200 my-8" />

            {/* Education Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Edukimi</h2>
              <button
                onClick={() => setShfaqFormenEdukimi(!shfaqFormenEdukimi)}
                className="flex items-center gap-1"
              >
                <Plus
                  size={28}
                  className="hover:bg-gray-100 p-1 rounded-full"
                />
              </button>
            </div>

            {shfaqFormenEdukimi && (
              <div className="px-6 py-4 bg-gray-50 mb-6 rounded-lg">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Titulli (Diplomë, Shkollim)"
                    value={edukimiRi.titulli}
                    onChange={(e) =>
                      setEdukimiRi({
                        ...edukimiRi,
                        titulli: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Institucioni"
                    value={edukimiRi.institucioni}
                    onChange={(e) =>
                      setEdukimiRi({
                        ...edukimiRi,
                        institucioni: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      placeholder="Data fillimit"
                      value={edukimiRi.dataFillimit}
                      onChange={(e) =>
                        setEdukimiRi({
                          ...edukimiRi,
                          dataFillimit: e.target.value,
                        })
                      }
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      placeholder="Data mbarimit"
                      value={edukimiRi.dataMbarimit}
                      onChange={(e) =>
                        setEdukimiRi({
                          ...edukimiRi,
                          dataMbarimit: e.target.value,
                        })
                      }
                      max={new Date().toISOString().split("T")[0]}
                      min={edukimiRi.dataFillimit || ""}
                      disabled={edukimiRi.aktuale}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        edukimiRi.aktuale ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="aktuale-edu"
                      checked={edukimiRi.aktuale}
                      onChange={(e) =>
                        setEdukimiRi({
                          ...edukimiRi,
                          aktuale: e.target.checked,
                          dataMbarimit: e.target.checked
                            ? ""
                            : edukimiRi.dataMbarimit,
                        })
                      }
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label
                      htmlFor="aktuale-edu"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Aktualisht studioj këtu
                    </label>
                  </div>
                  <textarea
                    placeholder="Përshkrimi"
                    value={edukimiRi.pershkrimi}
                    onChange={(e) =>
                      setEdukimiRi({
                        ...edukimiRi,
                        pershkrimi: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleShtoEdukimin}
                      className="publikoPune"
                    >
                      Ruaj
                    </button>
                    <button
                      onClick={() => setShfaqFormenEdukimi(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Anulo
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4">
              {!perdoruesiData?.edukimi ||
              perdoruesiData.edukimi.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nuk ka arsimim të shtuar ende
                </p>
              ) : (
                <div className="space-y-4">
                  {perdoruesiData.edukimi.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-purple-500 pl-4 py-2 relative group hover:bg-gray-50 rounded-r-lg transition-colors"
                    >
                      <button
                        onClick={() => handleFshijEdukimin(index)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={18} />
                      </button>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {edu.titulli}
                      </h3>
                      <p className="text-gray-700">{edu.institucioni}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateDDMMYYYY(edu.dataFillimit)} -{" "}
                        {edu.aktuale
                          ? "Aktuale"
                          : formatDateDDMMYYYY(edu.dataMbarimit)}
                      </p>
                      {edu.pershkrimi && (
                        <p className="text-gray-600 mt-2">{edu.pershkrimi}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-200 my-8" />

            {/* ========== SKILLS (AFTËSITË) SECTION – CORRECTED ========== */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Aftësitë</h2>
              <button
                onClick={() => setShfaqFormenAftesite(!shfaqFormenAftesite)}
                className="flex items-center gap-1"
              >
                <Plus
                  size={28}
                  className="hover:bg-gray-100 p-1 rounded-full"
                />
              </button>
            </div>

            {shfaqFormenAftesite && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Emri i aftësisë (p.sh. React, Projekt Menaxhim)"
                    value={aftesiRe}
                    onChange={(e) => setAftesiRe(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleShtoAftesine}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      Ruaj
                    </button>
                    <button
                      onClick={() => {
                        setShfaqFormenAftesite(false);
                        setAftesiRe("");
                      }}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                    >
                      Anulo
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {perdoruesiData?.aftesite?.map((aftesi, index) => (
                  <div key={index} className="group relative">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full text-sm">
                      {aftesi}
                    </span>
                    <button
                      onClick={() => handleFshijAftesine(index)}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {(!perdoruesiData?.aftesite ||
                  perdoruesiData.aftesite.length === 0) && (
                  <p className="text-gray-500 text-sm py-2">
                    Nuk ka aftësi të shtuara ende
                  </p>
                )}
              </div>
            </div>

            <hr className="border-gray-200 my-8" />

            {/* Projects Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Projektet
              </h2>
              <button
                onClick={() => setShfaqFormenProjektet(!shfaqFormenProjektet)}
                className="flex items-center gap-1"
              >
                <Plus
                  size={28}
                  className="hover:bg-gray-100 p-1 rounded-full"
                />
              </button>
            </div>

            {shfaqFormenProjektet && (
              <div className="px-6 py-4 bg-gray-50 mb-6 rounded-lg">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Emri i projektit"
                    value={projektRi.emriProjektit}
                    onChange={(e) =>
                      setProjektRi({
                        ...projektRi,
                        emriProjektit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Përshkrimi"
                    value={projektRi.pershkrimi}
                    onChange={(e) =>
                      setProjektRi({
                        ...projektRi,
                        pershkrimi: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <input
                    type="text"
                    placeholder="Teknologjitë (p.sh. React, Node.js, MongoDB)"
                    value={projektRi.teknologjite}
                    onChange={(e) =>
                      setProjektRi({
                        ...projektRi,
                        teknologjite: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Link (opsionale)"
                    value={projektRi.linku}
                    onChange={(e) =>
                      setProjektRi({ ...projektRi, linku: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleShtoProjekt} className="publikoPune">
                      Ruaj
                    </button>
                    <button
                      onClick={() => setShfaqFormenProjektet(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Anulo
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4">
              {!perdoruesiData?.projektet ||
              perdoruesiData.projektet.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nuk ka projekte të shtuara ende
                </p>
              ) : (
                <div className="space-y-4">
                  {perdoruesiData.projektet.map((proj, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-green-500 pl-4 py-2 relative group hover:bg-gray-50 rounded-r-lg transition-colors"
                    >
                      <button
                        onClick={() => handleFshijProjektin(index)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={18} />
                      </button>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {proj.emriProjektit}
                      </h3>
                      {proj.pershkrimi && (
                        <p className="text-gray-600 mt-2">{proj.pershkrimi}</p>
                      )}
                      {proj.teknologjite && (
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Teknologjitë:</span>{" "}
                          {proj.teknologjite}
                        </p>
                      )}
                      {proj.linku && (
                        <a
                          href={proj.linku}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                        >
                          Shiko projektin →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfiliAplikantit;
