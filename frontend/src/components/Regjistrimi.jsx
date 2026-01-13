import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { useState } from "react";
import axios from "axios";

function Regjistrimi() {
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
        alert("Zgjedh tipin");
        return;
      }

      if (tipiPerdoruesit === "aplikant") {
        dataToSend = {
          tipiPerdoruesit: "aplikant",
          emri: dataAplikant.emri,
          mbiemri: dataAplikant.mbiemri,
          email: dataAplikant.email,
          fjalekalimi: dataAplikant.fjalekalimi,
        };
      } else if (tipiPerdoruesit === "punedhenes") {
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
        alert(response.data.message);

        if (tipiPerdoruesit === "aplikant") {
          localStorage.setItem("emailForVerification", dataAplikant.email);
        } else if (tipiPerdoruesit === "punedhenes") {
          localStorage.setItem("emailForVerification", dataPunedhenesi.email);
        }
        navigate("/verifiko");
      }
    } catch (err) {
      if (err.response.data.error.includes("ekziston")) {
        alert("Perdoruesi ekziston!");
      }
      console.log("err: ", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div
        className="w-full max-w-[650px]
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
                <label
                  htmlFor="aplikant"
                  className="flex items-center justify-center p-3 border border-[#f7f7f7] rounded-lg cursor-pointer 
                 bg-[#f7f7f7] transition-all duration-200
                 peer-checked:border-[#6a6a6a] peer-checked:font-semibold"
                >
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
                <label
                  htmlFor="punedhenes"
                  className="flex items-center justify-center p-3 border border-[#f7f7f7] rounded-lg cursor-pointer 
                 bg-[#f7f7f7] transition-all duration-200
                 peer-checked:border-[#6a6a6a] peer-checked:font-semibold"
                >
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
                    className="border-[#f7f7f7] bg-[#f7f7f7] rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 placeholder-gray-500"
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
                    className="border-[#f7f7f7] bg-[#f7f7f7] rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 placeholder-gray-500"
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

          <div className="text-center text-sm sm:text-base">
            <p className="inline">Keni Llogari? </p>
            <Link
              to="/kycja"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Kycuni
            </Link>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-blue-600 underline text-sm sm:text-base hover:text-blue-800"
            >
              Ballina
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Regjistrimi;
