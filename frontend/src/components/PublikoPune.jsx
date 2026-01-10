import axios from "axios";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function PublikoPune() {
  const navigate = useNavigate();
  const [pyetjet, setPyetjet] = useState([]);
  const [pyetjaTanishme, setPyetjaTanishme] = useState("");
  const [formData, setFormData] = useState({
    emailKompanise: "",
    pozitaPunes: "",
    kategoriaPunes: "",
    lokacioniPunes: "",
    pershkrimiPunes: "",
    niveliPunes: "",
    orari: [],
    eksperienca: "",
    pagaPrej: 0,
    pagaDeri: 0,
  });

  const employmentTypes = [
    { value: "Fulltime", label: "Full-Time" },
    { value: "Part-time", label: "Part-Time" },
  ];

  const shtoPyetjen = () => {
    if (pyetjaTanishme.trim()) {
      setPyetjet([...pyetjet, pyetjaTanishme]);
      setPyetjaTanishme("");
    }
  };

  const fshijPyetjen = (index) => {
    const pyetjetReja = pyetjet.filter((_, i) => i !== index);
    setPyetjet(pyetjetReja);
  };

  // qetu
  const handleEmploymentTypeChange = (typeValue) => {
    setFormData((prevState) => {
      if (prevState.orari && prevState.orari.includes(typeValue)) {
        return {
          ...prevState,
          orari: [],
        };
      }

      return {
        ...prevState,
        orari: [typeValue],
      };
    });
  };
  // dej qetu

  useEffect(() => {
    const fetchPerdoruesiData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/kycja/perdoruesi",
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          setFormData({
            ...formData,
            emailKompanise: response.data.userResponse.email,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPerdoruesiData();
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let dataToSend = {
      emailKompanise: formData.emailKompanise,
      pozitaPunes: formData.pozitaPunes,
      kategoriaPunes: formData.kategoriaPunes,
      lokacioniPunes: formData.lokacioniPunes,
      pershkrimiPunes: formData.pershkrimiPunes,
      pyetjet: pyetjet,
      niveliPunes: formData.niveliPunes,
      orari: formData.orari,
      eksperienca: formData.eksperienca,
      pagaPrej: formData.pagaPrej,
      pagaDeri: formData.pagaDeri,
    };

    if (dataToSend.pagaDeri < dataToSend.pagaPrej) {
      alert("Rangu i pages eshte gabim!");
    }

    const response = await axios.post(
      "http://localhost:3000/api/shpallja/kompania",
      dataToSend,
    );

    if (response.data.success) {
      alert("Puna u shpall");

      setFormData({
        emailKompanise: "",
        pozitaPunes: "",
        kategoriaPunes: "",
        lokacioniPunes: "",
        pershkrimiPunes: "",
        niveliPunes: "",
        orari: [],
        eksperienca: "",
        pagaPrej: 0,
        pagaDeri: 0,
      });
      setPyetjet([]);
      setPyetjaTanishme("");
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen grid place-items-center my-20">
      <div className="grid rounded-xl border-2 border-gray-300 w-full max-w-xl py-10 sm:max-w-2xl md:max-w-4xl ">
        <h1 className="text-3xl md:text-4xl px-10">Publiko Punë të Re</h1>
        <p className="text-xl px-10 text-gray-600 py-3">
          Plotësoni formularin për të publikuar shpalljen tuaj
        </p>
        <hr className="border-gray-400" />
        <h1 className="text-xl md:text-2xl px-10 mt-6">Informacione Bazike</h1>
        <form onSubmit={handleSubmit} className="grid gap-4 p-10">
          <div>
            <label htmlFor="pozitaPunes" className="label">
              Emri <span className="text-red-400">*</span>
            </label>
            <input
              className="input"
              type="text"
              id="pozitaPunes"
              placeholder="Pozita e Punës"
              onChange={(e) =>
                setFormData({ ...formData, pozitaPunes: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <label htmlFor="kategoriaPunes" className="label">
                Kategoria
              </label>
              <select
                id="kategoriaPunes"
                className="input"
                value={formData.kategoriaPunes}
                onChange={(e) =>
                  setFormData({ ...formData, kategoriaPunes: e.target.value })
                }
              >
                <option value="" disabled>
                  Kategoria
                </option>
                <option value="Administrate">Administrate</option>
                <option value="IT">IT</option>
                <option value="Dizajner">Dizajner</option>
                <option value="Infermieri">Infermieri</option>
                <option value="Edukim">Edukim</option>
                <option value="Shitje dhe Marketing">
                  Shitje dhe Marketing
                </option>
              </select>
            </div>
            <div className="col-span-1">
              <label htmlFor="niveliPunes" className="label">
                Niveli Punes
              </label>
              <select
                id="niveliPunes"
                className="input"
                value={formData.niveliPunes}
                onChange={(e) =>
                  setFormData({ ...formData, niveliPunes: e.target.value })
                }
              >
                <option value="" disabled>
                  Zgjedh Nivelin
                </option>
                <option value="Praktike">Praktikë</option>
                <option value="Fillestar">Fillestar</option>
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lider">Lider</option>
                <option value="Menaxher">Menaxher</option>
                <option value="Drejtor">Drejtor</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-400 mt-10" />

          <h1 className="text-xl md:text-2xl mt-6">Informacione Shtese</h1>
          <div className="grid grid-cols-2 gap-6">
            <div className="mt-4">
              <label className="label block mb-2">Orari</label>
              <div className="flex flex-wrap gap-3">
                {employmentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleEmploymentTypeChange(type.value)}
                    className={`
                    px-4 py-2.5 rounded-md border-2 text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${
                      (formData.orari || []).includes(type.value)
                        ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }
                  `}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="paga" className="label block mb-2">
                Paga
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <input
                      type="number"
                      value={formData.pagaPrej || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pagaPrej: Number(e.target.value),
                        })
                      }
                      className="pl-7 pr-3 py-2 border border-gray-400 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Prej"
                      min="0"
                    />
                  </div>
                </div>

                <div className="text-gray-500">-</div>

                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <input
                      type="number"
                      value={formData.pagaDeri || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pagaDeri: Number(e.target.value),
                        })
                      }
                      className="pl-7 pr-3 py-2 border border-gray-400 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Deri"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Tregon rangun aktual */}
              {formData.pagaPrej > 0 && formData.pagaDeri > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Rangu aktual:{" "}
                  <span className="font-semibold">
                    €{formData.pagaPrej}-€{formData.pagaDeri}
                  </span>
                </div>
              )}

              {/* kallzon errorin nese vlera min eshte me e vogel se max*/}
              {formData.pagaDeri > 0 &&
                formData.pagaPrej > 0 &&
                formData.pagaDeri < formData.pagaPrej && (
                  <div className="mt-2 text-sm text-red-500">
                    Vlera "Deri" duhet të jetë më e madhe se "Prej"
                  </div>
                )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <label htmlFor="lokacioniPunes" className="label">
                Lokacioni
              </label>
              <select
                id="lokacioniPunes"
                className="input"
                value={formData.lokacioniPunes}
                onChange={(e) =>
                  setFormData({ ...formData, lokacioniPunes: e.target.value })
                }
              >
                <option value="Prishtine">Prishtinë</option>
                <option value="Prizren">Prizren</option>
                <option value="Peje">Pejë</option>
                <option value="Gjakove">Gjakovë</option>
                <option value="Mitrovice">Mitrovicë</option>
                <option value="Ferizaj">Ferizaj</option>
                <option value="Gjilan">Gjilan</option>
                <option value="Vushtrri">Vushtrri</option>
                <option value="Podujeve">Podujevë</option>
                <option value="Suhareke">Suharekë</option>
                <option value="Rahovec">Rahovec</option>
                <option value="Drenas">Drenas</option>
                <option value="Lipjan">Lipjan</option>
                <option value="Malisheve">Malishevë</option>
                <option value="Kamenice">Kamenicë</option>
                <option value="Viti">Viti</option>
                <option value="Skenderaj">Skenderaj</option>
                <option value="Istog">Istog</option>
                <option value="Kline">Klinë</option>
                <option value="Decan">Deçan</option>
                <option value="Junik">Junik</option>
                <option value="Dragash">Dragash</option>
                <option value="Kaçanik">Kaçanik</option>
                <option value="Hani_i_Elezit">Hani i Elezit</option>
                <option value="Shtime">Shtime</option>
                <option value="Obiliq">Obiliq</option>
                <option value="Fushe_Kosove">Fushë Kosovë</option>
                <option value="Kllokot">Kllokot</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="eksperienca" className="label">
                Eksperienca
              </label>
              <select
                id="eksperienca"
                className="input"
                value={formData.eksperienca}
                onChange={(e) =>
                  setFormData({ ...formData, eksperienca: e.target.value })
                }
              >
                <option value="" disabled>
                  Eksperienca
                </option>
                <option value="0-6 muaj">0-6 muaj</option>
                <option value="1">1 vjet</option>
                <option value="1-2">1-2 vjet</option>
                <option value="2-3">2-3 vjet</option>
                <option value="3-6">3-6 vjet</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-400 mt-10" />
          <h1 className="text-xl md:text-2xl mt-6">
            Pershkrimi dhe Pergjegjesite e punes
          </h1>
          <label htmlFor="pershkrimiPunes" className="label"></label>
          <textarea
            id="pershkrimiPunes"
            rows="5"
            cols="40"
            className="input"
            placeholder="Pershkrimi Punes"
            onChange={(e) =>
              setFormData({ ...formData, pershkrimiPunes: e.target.value })
            }
          ></textarea>

          {pyetjet.length > 0 && (
            <>
              <h1 className="label !text-l">Pergjegjesite</h1>
              <div className="grid rounded-sm border-2 border-gray-200 ">
                {pyetjet.map((pyetja, i) => {
                  return (
                    <div
                      key={i}
                      className="p-4 sm:p-5 rounded-xl flex justify-between items-center"
                    >
                      <span>{pyetja}</span>
                      <button
                        type="button"
                        className="cursor-pointer rounded-2xl text-red-400 hover:text-red-600 p-0"
                        onClick={() => fshijPyetjen(i)}
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="w-4 h-4"
                          style={{ display: "block" }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="border border-gray-400 rounded-sm flex justify-between gap-5 py-10 px-4">
            <input
              type="text"
              placeholder="Sheno kerkesen"
              className="w-full border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:ring-0 px-1 py-2 transition-colors"
              value={pyetjaTanishme}
              onChange={(e) => setPyetjaTanishme(e.target.value)}
            />
            <button
              type="button"
              className="cursor-pointer publikoPune !bg-green-400 w-fit py-2"
              onClick={() => shtoPyetjen()}
            >
              Shto
            </button>
          </div>

          <hr className="border-gray-400 " />
          <h1 className="text-xl md:text-2xl mt-6">Kerkesat dhe Aftesite</h1>
          <div className="flex justify-end">
            <button type="submit" className="publikoPune w-fit">
              Publiko
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PublikoPune;
