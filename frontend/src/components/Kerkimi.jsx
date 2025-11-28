import "../App.css";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
function Kerkimi() {
  return (
    <div className="h-150px flex justify-center items-center max-w-3xl mx-auto my-8 rounded-lg shadow-xl">
      <div className="kerkimi flex justify-center items-center my-5.5 bg-white">
        <form action="">
          <div className="inline">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="flex justify-center items-center mx-4"
            />
            <input
              type="text"
              placeholder="Kerko"
              className="px-2 h-14 w-auto"
            />
          </div>

          <div className="inline m-5">
            <FontAwesomeIcon icon={faLocationDot} />
            <select
              name="qyteti"
              id="qyteti"
              defaultValue=""
              className="bg-transparent border-0 cursor-pointer focus:outline-none"
            >
              <option value="" disabled hidden>
                Qyteti
              </option>
              <option value="koretin">Koretin</option>
              <option value="kamenica">Kamenica</option>
            </select>
          </div>

          <div className="inline m-5">
            <FontAwesomeIcon icon={faBriefcase} />
            <select
              name="kategoria"
              id="kategoria"
              defaultValue=""
              className="bg-transparent border-0 cursor-pointer focus:outline-none"
            >
              <option value="" disabled hidden>
                Kategoria
              </option>
              <option value="it">IT</option>
              <option value="ekonomi">Ekonomi</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-30 h-10 mx-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Kerko
          </button>
        </form>
      </div>
    </div>
  );
}

export default Kerkimi;
