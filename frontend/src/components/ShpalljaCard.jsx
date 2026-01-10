import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import "../index.css";
import { useNavigate } from "react-router-dom";

function ShpalljaCard({ shpallja }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/shpallja/${shpallja._id}`);
  };

  return (
    <div className="border border-gray-200 hover:bg-gray-200 shadow-xl rounded-xl w-full p-3">
      <div className="flex justify-between">
        <FontAwesomeIcon icon={faUser} className="text-3xl" />
        <FontAwesomeIcon icon={faBookmark} className="text-l" />
      </div>
      <p className="grid mt-6 font-bold text-l">{shpallja.pozitaPunes}</p>
      <div className="flex gap-5 mt-2">
        <p className="paragraf">
          {" "}
          <FontAwesomeIcon icon={faClock} />
          {shpallja.orari}
        </p>
        <p className="paragraf">{shpallja.niveliPunes}</p>
      </div>
      <hr className="border-0 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent mt-8 mb-3" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-l font-semibold flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
            {shpallja.pagaPrej}-{shpallja.pagaDeri}
          </p>
          <p className="paragraf text-sm text-gray-600 flex items-center mt-1">
            <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
            {shpallja.lokacioniPunes}
          </p>
        </div>
        <button
          className="relative group bg-transparent cursor-pointer"
          onClick={handleClick}
        >
          <span className="relative z-10  bg-linear-to-r from-slate-700 via-gray-800 to-black bg-clip-text text-transparent font-semibold text-l group-hover:from-slate-800 group-hover:via-gray-900 group-hover:to-black transition-all duration-300">
            Apliko tani
          </span>
          <FontAwesomeIcon
            icon={faArrowRightLong}
            className="ml-1 text-gray-700 group-hover:text-black group-hover:translate-x-1 transition-all duration-300"
          />
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-slate-700 to-black group-hover:w-full transition-all duration-500 ease-out"></div>
        </button>
      </div>
    </div>
  );
}
export default ShpalljaCard;
