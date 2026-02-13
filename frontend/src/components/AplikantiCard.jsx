import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import "../index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function AplikantiCard({ aplikanti }) {
  const navigate = useNavigate();
  const [fotoProfile, setFotoProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profili/${aplikanti._id}`,
        );
        // Ngarko foton e profile nese ekziston
        if (response.data.data.foto) {
          setFotoProfile(
            `http://localhost:3000/api/profili/${aplikanti._id}/foto`,
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (aplikanti._id) {
      fetchData();
    }
  }, [aplikanti._id]);

  const handleClick = () => {
    navigate(`/profiliAplikantit/${aplikanti._id}`);
  };

  const getInitials = (emri, mbiemri) => {
    if (!emri && !mbiemri) return "?";
    const firstInitial = emri ? emri.charAt(0).toUpperCase() : "";
    const lastInitial = mbiemri ? mbiemri.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-300 w-full p-6 transition-colors duration-200 shadow-lg">
      <div className="flex justify-between">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-linear-to-r from-slate-700 via-gray-800 to-black flex items-center justify-center">
          {fotoProfile ? (
            <img
              src={fotoProfile}
              alt="Foto Profilit"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-xl">
              {getInitials(aplikanti.emri, aplikanti.mbiemri)}
            </span>
          )}
        </div>
      </div>
      <p className="grid mt-6 font-bold text-xl">
        {aplikanti.emri} {aplikanti.mbiemri}
      </p>
      <div>
        <p className="flex items-center text-gray-700 font-medium">
          <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
          {aplikanti.email}
        </p>
      </div>
      <hr className="hrCard" />
      <div className="flex items-center justify-between">
        <div>
          <p className="paragraf text-sm text-gray-600 flex items-center mt-1"></p>
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

export default AplikantiCard;
