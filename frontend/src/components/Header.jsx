import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../App.css";
import "../index.css";

function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 max-w-7xl mx-auto flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <img className="w-24 h-auto" src={logo} alt="" />
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
      <div>
        <Link to="/kycja" className="kycja">
          Kycu/Regjistrohu
        </Link>
        <Link to="/publikoPune" className="publikoPune">
          Publiko Pune
        </Link>
      </div>
    </header>
  );
}

export default Header;
