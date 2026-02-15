import Header from "./Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";

function KonfigurimetLlogarise() {
  const [perdoruesiData, setPerdoruesiData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const togglePasswordVisibility = (field) => {
    if (field === "current") setShowPassword(!showPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "repeat") setShowRepeatPassword(!showRepeatPassword);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== repeatPassword) {
      alert("Fjalëkalimi i ri dhe konfirmimi nuk përputhen!");
      return;
    }

    try {
      let dataToSend;

      if (perdoruesiData.tipiPerdoruesit === "aplikant") {
        dataToSend = {
          tipiPerdoruesit: "aplikant",
          emri: perdoruesiData.emri,
          mbiemri: perdoruesiData.mbiemri,
          email: perdoruesiData.email,
          fjalekalimi: perdoruesiData.fjalekalimi,
          nrTelefonit: perdoruesiData.nrTelefonit,
        };
      } else if (perdoruesiData.tipiPerdoruesit === "punedhenes") {
        dataToSend = {
          tipiPerdoruesit: "punedhenes",
          kompania: perdoruesiData.kompania,
          email: perdoruesiData.email,
          fjalekalimi: perdoruesiData.fjalekalimi,
          nrTelefonit: perdoruesiData.nrTelefonit,
        };
      }

      if (currentPassword !== perdoruesiData.fjalekalimi) {
        alert("Fjalekalimi aktual nuk eshte i sakte");
        return;
      }

      if (newPassword) {
        dataToSend.fjalekalimi = newPassword;
      }

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        dataToSend,
      );

      if (response.data.success) {
        alert(response.data.message);
        setNewPassword("");
        setRepeatPassword("");
      } else if (
        response.data.data.message.includes(
          "Fjalëkalimi aktual nuk është i saktë",
        )
      ) {
        alert("Fjalekalimi aktual nuk eshte i sakte");
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const modifikoProfilin = (e) => {
    const { id, value } = e.target;
    setPerdoruesiData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with icon and title */}
          <div className="bg-[#0F4C75] px-8 py-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <FontAwesomeIcon icon={faUserCog} className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-left">
                  Konfigurimet e Llogarisë
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Përditësoni të dhënat personale dhe fjalëkalimin
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              autoComplete="off"
            >
              {/* Conditional fields based on user type */}
              {perdoruesiData.tipiPerdoruesit === "aplikant" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="emri"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Emri
                      </label>
                      <input
                        id="emri"
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                        onChange={modifikoProfilin}
                        value={perdoruesiData.emri || ""}
                        placeholder="Shkruani emrin"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="mbiemri"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mbiemri
                      </label>
                      <input
                        id="mbiemri"
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                        onChange={modifikoProfilin}
                        value={perdoruesiData.mbiemri || ""}
                        placeholder="Shkruani mbiemrin"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label
                    htmlFor="kompania"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Emri i Kompanisë
                  </label>
                  <input
                    id="kompania"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                    onChange={modifikoProfilin}
                    value={perdoruesiData.kompania || ""}
                    placeholder="Shkruani emrin e kompanisë"
                  />
                </div>
              )}

              {/* Email field - common for both */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                  onChange={modifikoProfilin}
                  value={perdoruesiData.email || ""}
                  placeholder="email@example.com"
                />
              </div>

              {/* Separator */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    Ndrysho fjalëkalimin
                  </span>
                </div>
              </div>

              {/* Password fields */}
              <div className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="fjalekalimi"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fjalëkalimi Aktual
                  </label>
                  <div className="relative">
                    <input
                      id="fjalekalimi"
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition pr-10"
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      value={currentPassword}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fjalëkalimi i Ri
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition pr-10"
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={showNewPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="repeatPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Konfirmo Fjalëkalimin e Ri
                  </label>
                  <div className="relative">
                    <input
                      id="repeatPassword"
                      type={showRepeatPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition pr-10"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      value={repeatPassword}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("repeat")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={showRepeatPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Password requirements card */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-[#0F4C75] mb-2">
                  Kërkesat për fjalëkalimin:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>të përmbajë shkronja të vogla dhe të mëdha</li>
                  <li>të përmbajë të paktën 1 numër ose simbol</li>
                  <li>të jetë të paktën 8 karaktere i gjatë</li>
                  <li>të përputhet në të dy fushat</li>
                  <li>të mos përmbajë hapësira</li>
                </ul>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] hover:from-[#3282B8] hover:to-[#0F4C75] text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:ring-offset-2 shadow-md"
                >
                  Përditëso të dhënat
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KonfigurimetLlogarise;
