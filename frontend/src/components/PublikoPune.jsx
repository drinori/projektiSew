import axios from "axios";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";

function PublikoPune() {
  const navigate = useNavigate();
  const [pyetjet, setPyetjet] = useState([]);
  const [pyetjaTanishme, setPyetjaTanishme] = useState("");
  const [kualifikimet, setKerkesatDheAftesite] = useState([]);
  const [kerkesaTanishme, setKerkesaTanishme] = useState("");

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
    { value: "Full-time", label: "Full-Time" },
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
  const shtoKerkesen = () => {
    if (kerkesaTanishme.trim()) {
      setKerkesatDheAftesite([...kualifikimet, kerkesaTanishme]);
      setKerkesaTanishme("");
    }
  };

  const fshijKerkesen = (index) => {
    const kerkesatReja = kualifikimet.filter((_, i) => i !== index);
    setKerkesatDheAftesite(kerkesatReja);
  };

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
            emailKompanise: response.data.perdoruesiObj.email,
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
      kualifikimet: kualifikimet,
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
      setKerkesatDheAftesite([]);
      setKerkesaTanishme("");
    }

    navigate("/");
  };

  return (
       <div className="flex flex-col items-center min-h-screen">
      <Header />
    <div className="min-h-screen grid place-items-center my-20">
      <div className="grid rounded-xl border-2 border-gray-300 w-full max-w-xl py-10 sm:max-w-2xl md:max-w-4xl">
        <div className="px-10">
          <h1 className="text-3xl md:text-4xl">Publiko Punë të Re</h1>
          <p className="text-xl text-gray-600 py-3">
            Plotësoni formularin për të publikuar shpalljen tuaj
          </p>
        </div>

        <hr className="border-gray-400" />

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="px-10 mt-6">
            <h1 className="text-xl md:text-2xl mb-4">Informacione Bazike</h1>

            <div className="grid gap-4">
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
                    Kategoria <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="kategoriaPunes"
                    className="input"
                    value={formData.kategoriaPunes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kategoriaPunes: e.target.value,
                      })
                    }
                  >
                    <option value="" hidden disabled>
                      Kategoria
                    </option>
                    <option value="industria">Industria</option>
                <option value="administrate">Administratë</option>
                <option value="agrikulture-industri-ushqimore">
                  Agrikulturë dhe Industri Ushqimore
                </option>
                <option value="arkitekture">Arkitekturë</option>
                <option value="banka">Banka</option>
                <option value="retail-distribuim">Retail dhe Distribuim</option>
                <option value="ndertimtari-patundshmeri">
                  Ndërtimtari & Patundshmëri
                </option>
                <option value="mbeshtetje-konsumatoreve-call-center">
                  Mbështetje e Konsumatorëve, Call Center
                </option>
                <option value="ekonomi-finance-kontabilitet">
                  Ekonomi, Financë, Kontabilitet
                </option>
                <option value="edukim-shkence-hulumtim">
                  Edukim, Shkencë & Hulumtim
                </option>
                <option value="pune-te-pergjithshme">
                  Punë të Përgjithshme
                </option>
                <option value="burime-njerezore">Burime Njerëzore</option>
                <option value="teknologji-informacioni">
                  Teknologji e Informacionit
                </option>
                <option value="sigurim">Sigurim</option>
                <option value="gazetari-shtyp-media">
                  Gazetari, Shtyp & Media
                </option>
                <option value="ligj-legjislacion">Ligj & Legjislacion</option>
                <option value="menaxhment">Menaxhment</option>
                <option value="marketing-reklamim-pr">
                  Marketing, Reklamim & PR
                </option>
                <option value="inxhinieri">Inxhinieri</option>
                <option value="shendetesi-medicine">
                  Shëndetësi, Medicinë
                </option>
                <option value="Prodhim">Prodhim</option>
                <option value="Siguri$Mbrojtje">Siguri&Mbrojtje</option>
                <option value="Industri te sherbimit">
                  Industri te sherbimit
                </option>
                <option value="Telekomunikim">Telekomunikim</option>
                <option value="Tekstil, Lekure, Industri Veshembathje">
                  Tekstil, Lekure, Industri Veshembathje
                </option>
                <option value="Gastronomi, Hoteleri, Turizem">
                  Gastronomi, Hoteleri, Turizem
                </option>
                <option value="Transport, Logjistike">
                  Transport, Logjistike
                </option>
                <option value="IT">
                  IT
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
                    <option value="" disabled hidden>
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
            </div>
          </div>

          <hr className="border-gray-400 mt-10" />

          <div className="px-10 mt-6">
            <h1 className="text-xl md:text-2xl mb-4">Informacione Shtese</h1>

            <div className="grid grid-cols-2 gap-6">
              <div className="mt-4">
                <label className="label block mb-2">
                  Orari <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {employmentTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleEmploymentTypeChange(type.value)}
                      className={`
                      px-4 py-2.5 rounded-md border text-sm font-medium
                      transition-all duration-200 ease-in-out
                      ${
                        (formData.orari || []).includes(type.value)
                          ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                          : "bg-white text-gray-700 border-gray-400 hover:border-gray-400"
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
                        className="input !pl-7 !pr-3"
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
                        className="input !pl-7 !pr-3 "
                        placeholder="Deri"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {formData.pagaPrej > 0 && formData.pagaDeri > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Rangu aktual:{" "}
                    <span className="font-semibold">
                      €{formData.pagaPrej}-€{formData.pagaDeri}
                    </span>
                  </div>
                )}

                {formData.pagaDeri > 0 &&
                  formData.pagaPrej > 0 &&
                  formData.pagaDeri < formData.pagaPrej && (
                    <div className="mt-2 text-sm text-red-500">
                      Vlera "Deri" duhet të jetë më e madhe se "Prej"
                    </div>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="col-span-1">
                <label htmlFor="lokacioniPunes" className="label">
                  Lokacioni <span className="text-red-400">*</span>
                </label>
                <select
                  id="lokacioniPunes"
                  className="input"
                  value={formData.lokacioniPunes}
                  onChange={(e) =>
                    setFormData({ ...formData, lokacioniPunes: e.target.value })
                  }
                >
                  <option value="" hidden disabled>
                    Lokacioni
                  </option>
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
                  <option value="" hidden disabled>
                    Eksperienca
                  </option>
                  <option value="0-6 muaj">0-6 muaj</option>
                  <option value="1 vjet">1 vjet</option>
                  <option value="1-2 vite">1-2 vite</option>
                  <option value="2-3 vite">2-3 vite</option>
                  <option value="3-6 vite">3-6 vite</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-400 mt-10" />

          <div className="px-10 mt-6">
            <h1 className="text-xl md:text-2xl mb-4">
              Pershkrimi dhe Pergjegjesite e punes
            </h1>

            <div className="w-full">
              <label htmlFor="pershkrimiPunes" className="label">
                Pershkrimi i Punës <span className="text-red-400">*</span>
              </label>
              <textarea
                id="pershkrimiPunes"
                rows="5"
                className="input w-full"
                placeholder="Shkruaj pershkrimin e detajuar te punes ketu..."
                value={formData.pershkrimiPunes}
                onChange={(e) =>
                  setFormData({ ...formData, pershkrimiPunes: e.target.value })
                }
              ></textarea>
            </div>

            {pyetjet.length > 0 && (
              <>
                <h1 className="label !text-l mt-4">Pergjegjesite</h1>
                <div className="grid rounded-sm border-2 border-gray-200">
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

            <div className="border border-gray-400 rounded-sm flex justify-between gap-5 py-10 px-4 mt-4">
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
          </div>

          <hr className="border-gray-400 mt-10" />

          <div className="px-10 mt-6">
            <h1 className="text-xl md:text-2xl mb-4">
              Kualifikimet e kërkuara
            </h1>

            {kualifikimet.length > 0 && (
              <>
                <h1 className="label !text-l">Lista e Kerkesave</h1>
                <div className="grid rounded-sm border-2 border-gray-200">
                  {kualifikimet.map((kerkesa, i) => {
                    return (
                      <div
                        key={i}
                        className="p-4 sm:p-5 rounded-xl flex justify-between items-center"
                      >
                        <span>{kerkesa}</span>
                        <button
                          type="button"
                          className="cursor-pointer rounded-2xl text-red-400 hover:text-red-600 p-0"
                          onClick={() => fshijKerkesen(i)}
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

            <div className="border border-gray-400 rounded-sm flex justify-between gap-5 py-10 px-4 mt-4">
              <input
                type="text"
                placeholder="Sheno kerkesen ose aftesine"
                className="w-full border-0 border-b-2 border-gray-400 focus:border-blue-500 focus:ring-0 px-1 py-2 transition-colors"
                value={kerkesaTanishme}
                onChange={(e) => setKerkesaTanishme(e.target.value)}
              />
              <button
                type="button"
                className="cursor-pointer publikoPune !bg-green-400 w-fit py-2"
                onClick={() => shtoKerkesen()}
              >
                Shto
              </button>
            </div>

            <div className="flex justify-end mt-6">
              <button type="submit" className="publikoPune w-fit">
                Publiko
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}

export default PublikoPune;
