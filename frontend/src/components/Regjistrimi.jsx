import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { useState } from "react";
import axios from "axios";
import { useAlert } from "../contexts/AlertContext";

function Regjistrimi() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [tipiPerdoruesit, setTipiPerdoruesit] = useState("");

  const [dataAplikant, setDataAplikant] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    fjalekalimi: "",
    konfirmoFjalekalimin: "",
  });

  const [dataPunedhenesi, setDataPunedhenesi] = useState({
    kompania: "",
    email: "",
    fjalekalimi: "",
    konfirmoFjalekalimin: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let dataToSend;

      if (!tipiPerdoruesit) {
        showAlert("Zgjedh tipin", "info");
        return;
      }

      if (tipiPerdoruesit === "aplikant") {
        if (
          dataAplikant.emri === "" ||
          dataAplikant.mbiemri === "" ||
          dataAplikant.email === "" ||
          dataAplikant.fjalekalimi === "" ||
          dataAplikant.konfirmoFjalekalimin === ""
        ) {
          showAlert("Plotesoni te gjitha fushat", "info");
          return;
        }
        if (dataAplikant.fjalekalimi !== dataAplikant.konfirmoFjalekalimin) {
          showAlert(
            "Fushat fjalekalimi dhe konfirmo fjalekalimin nuk jane te njejta!",
            "info",
          );
          return;
        }
        dataToSend = {
          tipiPerdoruesit: "aplikant",
          emri: dataAplikant.emri,
          mbiemri: dataAplikant.mbiemri,
          email: dataAplikant.email,
          fjalekalimi: dataAplikant.fjalekalimi,
        };
      } else if (tipiPerdoruesit === "punedhenes") {
        if (
          dataPunedhenesi.fjalekalimi !== dataPunedhenesi.konfirmoFjalekalimin
        ) {
          showAlert(
            "Fushat fjalekalimi dhe konfirmo fjalekalimin nuk jane te njejta!",
          );
          return;
        }

        dataToSend = {
          tipiPerdoruesit: "punedhenes",
          kompania: dataPunedhenesi.kompania,
          email: dataPunedhenesi.email,
          fjalekalimi: dataPunedhenesi.fjalekalimi,
        };
      }

      const response = await axios.post(
        "http://localhost:3000/api/regjistrimi/perdoruesi",
        dataToSend,
      );

      if (response.data.success) {
        showAlert(response.data.message, "success");

        if (tipiPerdoruesit === "aplikant") {
          localStorage.setItem("emailForVerification", dataAplikant.email);
        } else if (tipiPerdoruesit === "punedhenes") {
          localStorage.setItem("emailForVerification", dataPunedhenesi.email);
        }
        navigate("/verifiko");
      }
    } catch (err) {
      if (err.response.data.error.includes("ekziston")) {
        showAlert("Perdoruesi ekziston!", "error");
      }
      console.log("err: ", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-linear-to-br from-[#F7FBFC] to-[#B9D7EA] pb-10  shadow-[#0F4C75]">
      <div
        className="w-full max-w-162.5
                bg-white rounded-lg shadow-2xl 
                p-4 sm:p-6 md:p-8 lg:p-10"
      >
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="text-center">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-4 md:mb-6">
              Regjistrimi
            </h1>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="grid  grid-cols-[repeat(2,minmax(100px,130px))] place-self-center gap-3 sm:gap-4">
              <div>
                <input
                  id="aplikant"
                  type="radio"
                  name="tipiPerdoruesit"
                  value="aplikant"
                  className="hidden peer"
                  required
                  onChange={(e) => setTipiPerdoruesit(e.target.value)}
                />
                <label htmlFor="aplikant" className="labelRegjistrimi">
                  <span className="text-sm sm:text-base">Aplikant</span>
                </label>
              </div>

              <div>
                <input
                  id="punedhenes"
                  type="radio"
                  name="tipiPerdoruesit"
                  value="punedhenes"
                  className="hidden peer"
                  required
                  onChange={(e) => setTipiPerdoruesit(e.target.value)}
                />
                <label htmlFor="punedhenes" className="labelRegjistrimi">
                  <span className="text-sm sm:text-base">Punëdhënës</span>
                </label>
              </div>
            </div>
          </div>

          <div
            className={
              tipiPerdoruesit === "aplikant" || tipiPerdoruesit === ""
                ? "block"
                : "hidden"
            }
          >
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-3 sm:gap-4"
              autoComplete="off"
            >
              {[
                {
                  id: "emri",
                  label: "Emri",
                  placeholder: "Emri",
                  type: "text",
                },
                {
                  id: "mbiemri",
                  label: "Mbiemri",
                  placeholder: "Mbiemri",
                  type: "text",
                },
                {
                  id: "email",
                  label: "Email",
                  placeholder: "shembull@gmail.com",
                  type: "email",
                },
                {
                  id: "fjalekalimi",
                  label: "Fjalëkalimi",
                  placeholder: "Fjalëkalimi",
                  type: "password",
                },
                {
                  id: "konfirmoFjalekalimin",
                  label: "Konfirmo Fjalëkalimin",
                  placeholder: "Konfirmo fjalëkalimin",
                  type: "password",
                },
              ].map((field) => (
                <div key={field.id} className="grid grid-cols-1 gap-1">
                  <label htmlFor={field.id} className="text-sm sm:text-base">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 placeholder-gray-500"
                    onChange={(e) =>
                      setDataAplikant({
                        ...dataAplikant,
                        [field.id]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
              <div className="pt-2">
                <button
                  type="submit"
                  className="butoniKycjeRegjistrim w-full h-10 sm:h-12 text-sm sm:text-base"
                >
                  Regjistrohu
                </button>
              </div>
            </form>
          </div>

          <div
            className={tipiPerdoruesit === "punedhenes" ? "block" : "hidden"}
          >
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-3 sm:gap-4"
            >
              {[
                {
                  id: "kompania",
                  label: "Kompania",
                  placeholder: "Emri i kompanisë",
                  type: "text",
                },
                {
                  id: "email",
                  label: "Email",
                  placeholder: "kompania@gmail.com",
                  type: "email",
                },
                {
                  id: "fjalekalimi",
                  label: "Fjalëkalimin",
                  placeholder: "Fjalëkalimi",
                  type: "password",
                },
                {
                  id: "konfirmoFjalekalimin",
                  label: "Konfirmo fjalëkalimin",
                  placeholder: "Konfirmo fjalëkalimin",
                  type: "password",
                },
              ].map((field) => (
                <div key={field.id} className="grid grid-cols-1 gap-1">
                  <label htmlFor={field.id} className="text-sm sm:text-base">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 placeholder-gray-500"
                    onChange={(e) =>
                      setDataPunedhenesi({
                        ...dataPunedhenesi,
                        [field.id]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
              <div className="pt-2">
                <button
                  type="submit"
                  className="butoniKycjeRegjistrim w-full h-10 sm:h-12 text-sm sm:text-base"
                >
                  Regjistrohu
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <Link
              to="/"
              className="h-10 sm:h-12 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center"
            >
              ← Ballina
            </Link>
            
            <div className="grid gap-1">
               <p className="text-center text-sm  text-gray-600">Keni Llogari?</p>
              <Link
                to="/kycja"
                className="h-10 sm:h-12 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                Kycuni
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Regjistrimi;
