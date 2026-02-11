import Header from "./Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function KonfigurimetLlogarise() {
  const [perdoruesiData, setPerdoruesiData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const changeImage = () => {
    setShowPassword(!showPassword);
  };

  const changeNewPasswordImage = () => {
    setShowNewPassword(!showNewPassword);
  };

  const changeRepeatPasswordImage = () => {
    setShowRepeatPassword(!showRepeatPassword);
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

  useEffect(() => {
    console.log("perdoruesi: ", perdoruesiData);
  }, [perdoruesiData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validimi i fjalëkalimit të ri
    if (newPassword !== repeatPassword) {
      alert("Fjalëkalimi i ri dhe konfirmimi nuk përputhen!");
      return;
    }

    // Validimi i kërkesave për fjalëkalimin
    if (newPassword) {
      const hasLowerCase = /[a-z]/.test(newPassword);
      const hasUpperCase = /[A-Z]/.test(newPassword);
      const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
      const hasMinLength = newPassword.length >= 8;
      const hasNoSpaces = !/\s/.test(newPassword);
      const hasNoPipe = !/\|/.test(newPassword);

      if (
        !hasLowerCase ||
        !hasUpperCase ||
        !hasNumberOrSymbol ||
        !hasMinLength ||
        !hasNoSpaces ||
        !hasNoPipe
      ) {
        alert("Fjalëkalimi i ri nuk plotëson të gjitha kërkesat!");
        return;
      }
    }

    try {
      let dataToSend;

      if (perdoruesiData.tipiPerdoruesit === "aplikant") {
        dataToSend = {
          tipiPerdoruesit: "aplikant",
          emri: perdoruesiData.emri,
          mbiemri: perdoruesiData.mbiemri,
          email: perdoruesiData.email,
          fjalekalimi: newPassword || perdoruesiData.fjalekalimi,
          nrTelefonit: perdoruesiData.nrTelefonit,
        };
      } else if (perdoruesiData.tipiPerdoruesit === "punedhenes") {
        dataToSend = {
          tipiPerdoruesit: "punedhenes",
          kompania: perdoruesiData.kompania,
          email: perdoruesiData.email,
          fjalekalimi: newPassword || perdoruesiData.fjalekalimi,
          nrTelefonit: perdoruesiData.nrTelefonit,
        };
      }

      const response = await axios.put(
        `http://localhost:3000/api/profili/${id}`,
        dataToSend,
      );

      if (response.data.success) {
        alert(response.data.message);
        // Reset password fields after successful update
        setNewPassword("");
        setRepeatPassword("");
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const modifikoProfilin = (e) => {
    const { id, value } = e.target;
    setPerdoruesiData({
      ...perdoruesiData,
      [id]: value,
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />
      <div className="flex justify-center items-center w-full max-w-4xl mx-auto my-15">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
          <div className="p-8 flex justify-center border-b border-gray-100">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0F4C75] rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h1 className="text-2xl font-semibold  mb-2">Konfigurimet</h1>
              <p className="text-gray-600">Përditësoni të dhënat e llogarisë</p>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg ">
              <div className="space-y-2">
                <label htmlFor="emri" className="block text-sm font-medium ">
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
                <label htmlFor="mbiemri" className="block text-sm font-medium">
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

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
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

              {/* Current Password input */}
              <div>
                <div className="space-y-2">
                  <label
                    htmlFor="fjalekalimi"
                    className="block text-sm font-medium text"
                  >
                    Fjalëkalimi Aktual
                  </label>
                  <div className="relative">
                    <input
                      id="fjalekalimi"
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                      onChange={modifikoProfilin}
                      // value={perdoruesiData.fjalekalimi || ""}
                      placeholder="Fjalëkalimi aktual"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faEye}
                        className={
                          showPassword ? "!hidden" : "!block text-gray-800"
                        }
                        onClick={changeImage}
                        size="sm"
                      />
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        className={
                          showPassword ? "!block text-gray-600" : "!hidden"
                        }
                        onClick={changeImage}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* New Password input */}
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium"
                  >
                    Fjalëkalimi i Ri
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      placeholder="Fjalëkalimi i ri"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faEye}
                        className={
                          showNewPassword ? "!hidden" : "!block text-gray-800"
                        }
                        onClick={changeNewPasswordImage}
                        size="sm"
                      />
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        className={
                          showNewPassword ? "!block text-gray-600" : "!hidden"
                        }
                        onClick={changeNewPasswordImage}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Repeat Password input */}
                <div className="space-y-2">
                  <label
                    htmlFor="repeatPassword"
                    className="block text-sm font-medium"
                  >
                    Konfirmo Fjalëkalimin e Ri
                  </label>
                  <div className="relative">
                    <input
                      id="repeatPassword"
                      type={showRepeatPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      value={repeatPassword}
                      placeholder="Konfirmo fjalëkalimin e ri"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faEye}
                        className={
                          showRepeatPassword
                            ? "!hidden"
                            : "!block text-gray-800"
                        }
                        onClick={changeRepeatPasswordImage}
                        size="sm"
                      />
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        className={
                          showRepeatPassword
                            ? "!block text-gray-600"
                            : "!hidden"
                        }
                        onClick={changeRepeatPasswordImage}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Password requirements */}
                <div className="pt-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium  mb-2">Fjalëkalimi duhet të:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>përmbajë shkronja të vogla dhe të mëdha</li>
                      <li>përmbajë të paktën 1 numër ose simbol</li>
                      <li>të jetë të paktën 8 karaktere i gjatë</li>
                      <li>të përputhet në të dy fushat</li>
                      <li>të mos përmbajë hapësira</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#0F4C75] hover:bg-[#3282B8] text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:ring-offset-2"
                >
                  Përditëso
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
