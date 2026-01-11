import "../App.css";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Kerkimi() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    kerko: "",
    lokacioniPunes: "",
    kategoriaPunes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (filters.kerko.trim()) {
      params.append("kerko", filters.kerko.trim());
    }

    if (filters.lokacioniPunes.trim()) {
      params.append("lokacioniPunes", filters.lokacioniPunes.trim());
    }

    if (filters.kategoriaPunes.trim()) {
      params.append("kategoriaPunes", filters.kategoriaPunes.trim());
    }

    navigate(`/?${params.toString()}`);
  };
  return (
    <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto px-4 my-8">
      <div className="border border-gray-200 rounded-4xl shadow-xl bg-white">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg focus-within:border-blue-500">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-gray-400"
              />
              <input
                type="text"
                placeholder="Kerko"
                className="w-full bg-transparent focus:outline-none"
                value={filters.kerko}
                onChange={(e) =>
                  setFilters({ ...filters, kerko: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg focus-within:border-blue-500">
              <FontAwesomeIcon icon={faLocationDot} className="text-gray-400" />
              <select
                name="lokacioniPunes"
                className="w-full bg-transparent cursor-pointer focus:outline-none"
                value={filters.lokacioniPunes}
                onChange={(e) =>
                  setFilters({ ...filters, lokacioniPunes: e.target.value })
                }
              >
                <option value="" hidden>
                  Qyteti
                </option>
                <option value="Decan">Decan</option>
                <option value="Drenas">Drenas</option>
                <option value="Gjakove">Gjakove</option>
                <option value="Gjilan">Gjilan</option>
                <option value="Dragash">Dragash</option>
                <option value="Kacanik">Kacanik</option>
                <option value="Kline">Kline</option>
                <option value="Fushe Kosove">Fushe Kosove</option>
                <option value="Kamenice">Kamenice</option>
                <option value="Mitrovica">Mitrovica</option>
                <option value="Lipjan">Lipjan</option>
                <option value="Obiliq">Obiliq</option>
                <option value="Rahovec">Rahovec</option>
                <option value="Peje">Peje</option>
                <option value="Podujeve">Podujeve</option>
                <option value="Prishtine">Prishtine</option>
                <option value="Prizren">Prizren</option>
                <option value="Skenderaj">Skenderaj</option>
                <option value="Shtime">Shtime</option>
                <option value="Suhareke">Suhareke</option>
                <option value="Ferizaj">Ferizaj</option>
                <option value="Viti">Viti</option>
                <option value="Vushtrri">Vushtrri</option>
                <option value="Malisheve">Malisheve</option>
                <option value="Junik">Junik</option>
                <option value="Hani I Elezit">Hani I Elezit</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg focus-within:border-blue-500">
              <FontAwesomeIcon icon={faBriefcase} className="text-gray-400" />
              <select
                name="kategoriaPunes"
                className="w-full bg-transparent cursor-pointer focus:outline-none"
                value={filters.kategoriaPunes}
                onChange={(e) =>
                  setFilters({ ...filters, kategoriaPunes: e.target.value })
                }
              >
                <option value="" hidden>
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
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto px-6 py-2 rounded-4xl bg-[#0F4C75] text-white font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Kerko
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Kerkimi;
