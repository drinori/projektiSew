import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons/faAtlassian";
import { useEffect, useState } from "react";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const [perdoruesiData, setPerdoruesiData] = useState(null);

  const handleCkycja = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/ckycja/perdoruesi",
        {},
        { withCredentials: true },
      );

      setPerdoruesiData(null);
      localStorage.removeItem("user");
      console.log("Ckycja u be", response.data);
    } catch (error) {
      console.error(error);
    }
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
          setPerdoruesiData(response.data.userResponse);
        } else {
          navigate("/kycja");
        }
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPerdoruesiData();
  }, [navigate]);

  return (
    <header>
      <div
        className="bg-white shadow-md py-7 px-6 mx-auto flex justify-between items-center ml-auto text-l rounded-2xl
        "
      >
        <Link to="/" className="flex items-center mr-8">
          <FontAwesomeIcon icon={faAtlassian} className="text-2xl" />
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="nav-link">
            Ballina
          </Link>
          <Link to="/listaPuneve" className="nav-link">
            Lista e Puneve
          </Link>
          <Link to="/listaKompanive" className="nav-link">
            Lista e Kompanive
          </Link>
          <Link to="/rrethNesh" className="nav-link">
            Rreth Nesh
          </Link>
        </nav>

        {perdoruesiData ? (
          <div className="flex space-x-4 ml-auto">
            <Link to="/profili">
              {perdoruesiData.emri || perdoruesiData.kompania}
            </Link>
            <button
              type="button"
              className="cursor-pointer publikoPune"
              onClick={handleCkycja}
            >
              C'kycu
            </button>
          </div>
        ) : (
          <div className="flex space-x-4 ml-auto">
            <Link to="/kycja" className="kycja">
              Kycu/Regjistrohu
            </Link>
            <Link to="/publikopune" className="publikoPune">
              Publiko Pune
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
