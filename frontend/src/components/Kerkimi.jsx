import "../App.css";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Kerkimi() {
  const navigate = useNavigate();
  const location = useLocation();
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

    navigate(`${location.pathname}?${params.toString()}`);
  };
  return (
    <div className="w-full max-w-6xl mx-auto px-4 my-8">
      <div className="bg-white border border-gray-100 rounded-4xl shadow-xl ">
        <form onSubmit={handleSubmit}>
          <div className="responsiveKerko">
            <div className="kerko">
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

            <div className="kerko">
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

            <div className="kerko">
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
                <option value="IT">IT</option>
              </select>
            </div>

            <button type="submit" className="publikoPune">
              Kerko
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Kerkimi;
