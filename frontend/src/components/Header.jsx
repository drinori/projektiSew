import { Link } from "react-router-dom";
import "../App.css";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons/faAtlassian";

function Header() {
  return (
    <div className="flex">
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
    </div>
  );
}

export default Header;
