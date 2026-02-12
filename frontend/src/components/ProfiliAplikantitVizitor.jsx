import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaGraduationCap,
  FaBriefcase,
  FaLink,
} from "react-icons/fa";
import Header from "./Header";
import axios from "axios";
import { useParams } from "react-router-dom";
import Perdoruesi from "../PerdoruesiContext";

const ProfiliAplikantitVizitor = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fotoProfile, setFotoProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("experience");

  const { perdoruesiData: currentUser } = Perdoruesi.usePerdoruesi();

  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (err) {
      console.error("Error formatting date:", dateString, err);
      return "";
    }
  };

  const merreShkronjatFillestare = () => {
    if (profileData && profileData.emri && profileData.mbiemri) {
      return (profileData.emri[0] + profileData.mbiemri[0]).toUpperCase();
    }
    if (profileData && profileData.kompania) {
      return profileData.kompania.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/profili/" + id,
        );
        const userData = response.data.data;
        setProfileData(userData);
        if (userData.foto) {
          setFotoProfile("http://localhost:3000/api/profili/" + id + "/foto");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Gabim ne ngarkimin e te dhenave te profilit");
        setLoading(false);
      }
    };

    if (id) fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Duke ngarkuar profilin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex flex-col items-center min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>{error || "Diqka shkoi keq. Profili nuk u gjet."}</p>
          </div>
        </div>
      </div>
    );
  }

  const eksperiencat = profileData.eksperiencat || [];
  const edukimi = profileData.edukimi || [];
  const projektet = profileData.projektet || [];
  const linqet = profileData.linqet || [];
  const eshteVetja = currentUser && currentUser._id === profileData._id;

  const tabs = [
    { key: "experience", label: "Pervoja" },
    { key: "education", label: "Edukimi" },
    { key: "projects", label: "Projektet" },
    { key: "info", label: "Informacione" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <Header />

      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white">
                {fotoProfile ? (
                  <img
                    src={fotoProfile}
                    alt="Foto Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 text-2xl font-bold">
                    {merreShkronjatFillestare()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-8">
            <h1 className="text-3xl text-left font-bold text-gray-900 mb-2">
              {profileData.emri || profileData.kompania || ""}{" "}
              {profileData.mbiemri || ""}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              {profileData.email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope size={14} />
                  <span>{profileData.email}</span>
                </div>
              )}
              {profileData.nrTelefonit && (
                <div className="flex items-center gap-2">
                  <FaPhone size={14} />
                  <span>{profileData.nrTelefonit}</span>
                </div>
              )}
              {eksperiencat.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaBriefcase size={14} />
                  <span>{eksperiencat.length} pervoja</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-gray-200 mx-10">
            <div className="flex justify-center gap-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-4 font-medium text-sm transition-all relative ${
                    activeTab === tab.key
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transition-all duration-300"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "experience" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Pervoja Profesionale
                </h2>
                {eksperiencat.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">
                    Nuk ka pervoja te shtuara
                  </p>
                ) : (
                  <div className="space-y-4">
                    {eksperiencat.map((exp, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <FaBriefcase className="text-blue-600" size={18} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {exp.titulli}
                            </h3>
                            <p className="text-gray-600 font-medium">
                              {exp.kompania}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {formatDateDDMMYYYY(exp.dataFillimit)}
                              {" - "}
                              {exp.aktuale
                                ? "Aktuale"
                                : formatDateDDMMYYYY(exp.dataMbarimit)}
                            </p>
                            {exp.pershkrimi && (
                              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                                {exp.pershkrimi}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "education" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Edukimi
                </h2>
                {edukimi.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">
                    Nuk ka arsimim te shtuar
                  </p>
                ) : (
                  <div className="space-y-4">
                    {edukimi.map((edu, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                            <FaGraduationCap
                              className="text-purple-600"
                              size={18}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {edu.titulli}
                            </h3>
                            <p className="text-gray-600 font-medium">
                              {edu.institucioni}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {formatDateDDMMYYYY(edu.dataFillimit)}
                              {" - "}
                              {edu.aktualet
                                ? "Aktuale"
                                : formatDateDDMMYYYY(edu.dataMbarimit)}
                            </p>
                            {edu.pershkrimi && (
                              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                                {edu.pershkrimi}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Projektet
                </h2>
                {projektet.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">
                    Nuk ka projekte te shtuara
                  </p>
                ) : (
                  <div className="space-y-4">
                    {projektet.map((proj, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                            <FaLink className="text-green-600" size={16} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {proj.emriProjektit}
                            </h3>
                            {proj.pershkrimi && (
                              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                {proj.pershkrimi}
                              </p>
                            )}
                            {proj.teknologjite && (
                              <p className="text-sm text-gray-500 mt-2">
                                <span className="font-medium text-gray-700">
                                  Teknologjite:
                                </span>
                                {" " + proj.teknologjite}
                              </p>
                            )}
                            {proj.linku && (
                              <a
                                href={proj.linku}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
                              >
                                Shiko projektin
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "info" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Informacione Kontaktuese
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-blue-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-gray-900 font-medium">
                        {profileData.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {profileData.nrTelefonit && (
                    <div className="flex items-start gap-3">
                      <FaPhone className="text-blue-500 shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Telefon</p>
                        <p className="text-gray-900 font-medium">
                          {profileData.nrTelefonit}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <FaCalendarAlt className="text-blue-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Anetar qe nga
                      </p>
                      <p className="text-gray-900 font-medium">
                        {profileData.createdAt
                          ? formatDateDDMMYYYY(profileData.createdAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {linqet.length > 0 && (
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Linqet Sociale
                      </h3>
                      <div className="space-y-3">
                        {linqet.map((socialLink, index) => (
                          <a
                            key={index}
                            href={socialLink.linku}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {socialLink.platforma}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {eshteVetja && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-center text-sm">
              Ju jeni duke pare profilin tuaj. Per te ndryshuar te dhena, shkoni
              te faqja e profilit tuaj.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfiliAplikantitVizitor;
