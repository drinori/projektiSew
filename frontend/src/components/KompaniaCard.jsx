import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import "../index.css";
import { useNavigate } from "react-router-dom";

function KompaniaCard({ kompania }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/kompania/${kompania._id}`);
  };


  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };
  return (
    <div className="border border-gray-200 hover:bg-gray-200 shadow-xl rounded-xl w-full p-3">
      <div className="flex justify-between">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-linear-to-r from-slate-700 via-gray-800 to-black flex items-center justify-center">
          {/* TODO: Me shtu foton e profilit tkompanise */}

          <span className="text-white font-bold text-xl">
            {getInitials(kompania.kompania)}
          </span>
        </div>
        <FontAwesomeIcon icon={faBookmark} className="text-l" />
      </div>
      <p className="grid mt-6 font-bold text-xl">{kompania.kompania}</p>
      <div>
        <p className="flex items-center text-gray-700 font-medium">
          <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
          {kompania.email}
        </p>
        {/*TODO: Me shtu shpalljet e publikuara per kompani  */}
      </div>
      <hr className="hrCard" />
      <div className="flex items-center justify-between">
        <div>
          <p className="paragraf text-sm text-gray-600 flex items-center mt-1">
            {/* TODO: Me shtu lokacionin e kompanise */}
            <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
            {kompania.lokacioni || "N/A"}
          </p>
        </div>
        <button
          className="relative group bg-transparent cursor-pointer"
          onClick={handleClick}
        >
          <span className="relative z-10 bg-linear-to-r from-slate-700 via-gray-800 to-black bg-clip-text text-transparent font-semibold text-l group-hover:from-slate-800 group-hover:via-gray-900 group-hover:to-black transition-all duration-300">
            Shiko më shumë
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

export default KompaniaCard;
