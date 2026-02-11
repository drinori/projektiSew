import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
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

  const { perdoruesiData: currentUser } = Perdoruesi.usePerdoruesi();

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

  // Get initials for profile picture
  const merreShkronjatFillestare = () => {
    if (profileData?.emri && profileData?.mbiemri) {
      return `${profileData.emri[0]}${profileData.mbiemri[0]}`.toUpperCase();
    } else if (profileData?.kompania) {
      return profileData.kompania.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch user profile data
        const response = await axios.get(
          `http://localhost:3000/api/profili/${id}`,
        );

        const userData = response.data.data;
        setProfileData(userData);

        // Load profile photo if exists
        if (userData.foto) {
          setFotoProfile(`http://localhost:3000/api/profili/${id}/foto`);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Gabim në ngarkimin e të dhënave të profilit");
        setLoading(false);
      }
    };

    if (id) {
      fetchProfileData();
    }
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

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 w-full">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header - View Only */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 mt-10">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-black text-3xl font-bold overflow-hidden">
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
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {profileData.emri || profileData.kompania}{" "}
                      {profileData.mbiemri}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Experience Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b flex items-center gap-2">
                  <FaBriefcase /> Përvoja Profesionale
                </h3>
                {!profileData.eksperiencat ||
                profileData.eksperiencat.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nuk ka përvoja të shtuara
                  </p>
                ) : (
                  <div className="space-y-6">
                    {profileData.eksperiencat.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                      >
                        <h4 className="font-semibold text-lg text-gray-900">
                          {exp.titulli}
                        </h4>
                        <p className="text-gray-700">{exp.kompania}</p>
                        <p className="text-sm text-gray-500">
                          {formatDateDDMMYYYY(exp.dataFillimit)} -{" "}
                          {exp.aktuale
                            ? "Aktuale"
                            : formatDateDDMMYYYY(exp.dataMbarimit)}
                        </p>
                        {exp.pershkrimi && (
                          <p className="text-gray-600 mt-3">{exp.pershkrimi}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Education Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b flex items-center gap-2">
                  <FaGraduationCap /> Edukimi
                </h3>
                {!profileData.edukimi || profileData.edukimi.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nuk ka arsimim të shtuar
                  </p>
                ) : (
                  <div className="space-y-6">
                    {profileData.edukimi.map((edu, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-purple-500 pl-4 py-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                      >
                        <h4 className="font-semibold text-lg text-gray-900">
                          {edu.titulli}
                        </h4>
                        <p className="text-gray-700">{edu.institucioni}</p>
                        <p className="text-sm text-gray-500">
                          {formatDateDDMMYYYY(edu.dataFillimit)} -{" "}
                          {edu.aktualet
                            ? "Aktuale"
                            : formatDateDDMMYYYY(edu.dataMbarimit)}
                        </p>
                        {edu.pershkrimi && (
                          <p className="text-gray-600 mt-3">{edu.pershkrimi}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">
                  Projektet
                </h3>
                {!profileData.projektet ||
                profileData.projektet.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nuk ka projekte të shtuara
                  </p>
                ) : (
                  <div className="space-y-6">
                    {profileData.projektet.map((proj, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-green-500 pl-4 py-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                      >
                        <h4 className="font-semibold text-lg text-gray-900">
                          {proj.emriProjektit}
                        </h4>
                        {proj.pershkrimi && (
                          <p className="text-gray-600 mt-2">
                            {proj.pershkrimi}
                          </p>
                        )}
                        {proj.teknologjite && (
                          <div className="mt-3">
                            <span className="font-medium text-sm text-gray-700">
                              Teknologjitë:
                            </span>
                            <p className="text-gray-600 text-sm mt-1">
                              {proj.teknologjite}
                            </p>
                          </div>
                        )}
                        {proj.linku && (
                          <a
                            href={proj.linku}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
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

            {/* Right Column - Contact and Additional Info */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                  Informacione Kontaktuese
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-700 font-medium">
                        {profileData.email}
                      </p>
                    </div>
                  </div>

                  {profileData.nrTelefonit && (
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Telefon</p>
                        <p className="text-gray-700 font-medium">
                          {profileData.nrTelefonit}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Anëtar që nga</p>
                      <p className="text-gray-700 font-medium">
                        {profileData.createdAt
                          ? formatDateDDMMYYYY(profileData.createdAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {profileData.linqet && profileData.linqet.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                    Linqet Sociale
                  </h3>
                  <div className="space-y-3">
                    {profileData.linqet.map((link, index) => (
                      <a
                        key={index}
                        href={link.linku}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                      >
                        <FaLink className="text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {link.platforma}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {link.linku}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Jobs (if applicant) */}
              {profileData.tipiPerdoruesit === "aplikant" &&
                profileData.punetRuajtura &&
                profileData.punetRuajtura.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                      Punët e Ruajtura
                    </h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        Ka ruajtur {profileData.punetRuajtura.length} punë
                      </p>
                      {/* You could fetch and display job details here if needed */}
                    </div>
                  </div>
                )}

              {/* If it's a company profile */}
              {profileData.tipiPerdoruesit === "punedhenes" &&
                profileData.kompania && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                      Informacione të Kompanisë
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Emri i Kompanisë
                        </p>
                        <p className="text-gray-700 font-medium">
                          {profileData.kompania}
                        </p>
                      </div>
                      {profileData.email && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Email i Kompanisë
                          </p>
                          <p className="text-gray-700 font-medium">
                            {profileData.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Optional: Display if current user is viewing their own profile */}
          {currentUser && currentUser._id === profileData._id && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-center">
                ⓘ Ju jeni duke parë profilin tuaj. Për të ndryshuar të dhëna,
                shkoni te faqja e profilit tuaj.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfiliAplikantitVizitor;
