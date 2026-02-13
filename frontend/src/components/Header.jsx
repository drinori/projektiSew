import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../App.css";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons/faAtlassian";
import { SquareChartGantt, Heart, Settings, LogOut, User } from "lucide-react";

import {
  faBars,
  faTimes,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import Perdoruesi from "../PerdoruesiContext";

function Header() {
  const navigate = useNavigate();
  const { perdoruesiData, setPerdoruesiData } = Perdoruesi.usePerdoruesi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMobileProfileOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileProfileOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMobileProfile = () => {
    setIsMobileProfileOpen(!isMobileProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCkycja = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/ckycja/perdoruesi",
        {},
      );

      setPerdoruesiData(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      console.log("Ckycja u be", response.data);
      closeDropdown();
      navigate("/");
    } catch (error) {
      console.error(error);
      setPerdoruesiData(null);
      localStorage.clear();
    }
  };

  const isPunedhenes = perdoruesiData?.tipiPerdoruesit === "punedhenes";

  return (
    <>
      <div className="flex items-center justify-between w-full bg-transparent py-5 px-6 mx-auto text-base">
        <Link to="/" className="flex items-center mr-8">
          <FontAwesomeIcon icon={faAtlassian} className="text-2xl" />
          <h1 className="text-2xl text-primary">𝗣𝘂𝗻𝗲𝘀𝗼𝗵𝘂</h1>
        </Link>

        <nav className="hidden md:flex space-x-8 ">
          <Link to="/" className="nav-link">
            Ballina
          </Link>
          <Link to="/listaPuneve" className="nav-link">
            Lista e Puneve
          </Link>
          <Link to="/listaKompanive" className="nav-link">
            Lista e Kompanive
          </Link>
          <Link to="/listaAplikanteve" className="nav-link">
            Lista e Aplikanteve
          </Link>

          {isPunedhenes && (
            <Link to="/publikopune" className="nav-link">
              Publiko Pune
            </Link>
          )}
          <Link to="/rrethNesh" className="nav-link">
            Rreth Nesh
          </Link>
        </nav>

        <div className="hidden md:flex space-x-4 items-center ml-auto">
          {perdoruesiData ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User size={18} />
                  <span style={{ color: "#3f3f46", fontWeight: "500" }}>
                    {perdoruesiData.tipiPerdoruesit === "punedhenes"
                      ? perdoruesiData.kompania
                      : perdoruesiData.emri}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-sm transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    style={{ color: "#71717a" }}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to={`/profili/${perdoruesiData._id}`}
                      className="profileDropDown"
                      onClick={closeDropdown}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="mr-3 text-[#0F4C75]"
                      />
                      Profili
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    {isPunedhenes ? (
                      <Link
                        to={`/profili/${perdoruesiData._id}/menaxhoShpalljet`}
                        className="profileDropDown"
                        onClick={closeDropdown}
                      >
                        <SquareChartGantt
                          size={20}
                          className="mr-3 text-[#0F4C75]"
                        />
                        Menaxho Shpalljet
                      </Link>
                    ) : (
                      <Link
                        to={`/profili/${perdoruesiData._id}/menaxhoAplikimet`}
                        className="profileDropDown"
                        onClick={closeDropdown}
                      >
                        <SquareChartGantt
                          size={20}
                          className="mr-3 text-[#0F4C75]"
                        />
                        Menaxho Aplikimet
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200" />
                    <Link
                      to={`/profili/${perdoruesiData._id}/konfigurimet`}
                      className="profileDropDown"
                      onClick={closeDropdown}
                    >
                      <Settings size={20} className="mr-3 text-[#0F4C75]" />
                      Konfigurimet e Llogarise
                    </Link>
                    <div className={`${isPunedhenes ? "hidden" : "block"}`}>
                      <hr className="my-2 border-gray-200" />
                      <Link
                        to={`/profili/${perdoruesiData._id}/punetRuajtura`}
                        className="profileDropDown"
                        onClick={closeDropdown}
                      >
                        <Heart size={20} className="mr-3 text-[#0F4C75]" />
                        Punet e Ruajtura
                      </Link>
                    </div>

                    <hr className="my-2 border-gray-200" />
                    <button
                      type="button"
                      className="w-full text-center flex items-center px-4 py-2 hover:text-red-600 transition-colors"
                      onClick={handleCkycja}
                    >
                      <LogOut
                        size={20}
                        className="mr-3 text-[#0F4C75] hover:text-red-500"
                      />
                      C'kycu
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/kycja" className="kycja">
                Kycu/Regjistrohu
              </Link>
              <Link to="/kycja" className="publikoPune">
                Publiko Pune
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl ml-auto"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-2xl overflow-hidden ">
          <nav className="flex flex-col py-6 px-6">
            <Link
              to="/"
              className="text-lg font-medium py-3 hover:text-[#0F4C75] transition-colors"
              onClick={closeMenu}
            >
              Ballina
            </Link>
            <Link
              to="/listaPuneve"
              className="text-lg font-medium py-3 hover:text-[#0F4C75] transition-colors"
              onClick={closeMenu}
            >
              Lista e Puneve
            </Link>
            <Link
              to="/listaKompanive"
              className="text-lg font-medium py-3 hover:text-[#0F4C75] transition-colors"
              onClick={closeMenu}
            >
              Lista e Kompanive
            </Link>
            <Link
              to="/listaAplikanteve"
              className="text-lg font-medium py-3 hover:text-[#0F4C75] transition-colors"
              onClick={closeMenu}
            >
              Lista e Aplikanteve
            </Link>

            <Link
              to="/rrethNesh"
              className="text-lg font-medium py-3 hover:text-[#0F4C75] transition-colors"
              onClick={closeMenu}
            >
              Rreth Nesh
            </Link>

            {isPunedhenes && (
              <Link
                to="/publikopune"
                className="text-lg font-medium py-3 hover:text-[#0F4C75] transition-colors"
                onClick={closeMenu}
              >
                Publiko Pune
              </Link>
            )}

            {perdoruesiData ? (
              <div className="mt-4 border-t border-t-gray-300 pt-4">
                <button
                  onClick={toggleMobileProfile}
                  className="flex items-center justify-between w-full text-left py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User size={18} />
                    <span className="font-medium text-[#3f3f46]">
                      {perdoruesiData.tipiPerdoruesit === "punedhenes"
                        ? perdoruesiData.kompania
                        : perdoruesiData.emri}
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-sm transition-transform ${
                      isMobileProfileOpen ? "rotate-180" : ""
                    }`}
                    style={{ color: "#71717a" }}
                  />
                </button>

                {isMobileProfileOpen && (
                  <div className="mt-2 pl-4 space-y-2 border-l-2 border-gray-300">
                    <Link
                      to={`/profili/${perdoruesiData._id}`}
                      className="flex items-center gap-3 py-2 px-3 text-[#3f3f46] hover:text-[#0F4C75] transition-colors"
                      onClick={closeMenu}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-[#0F4C75]"
                      />
                      Profili
                    </Link>

                    {isPunedhenes ? (
                      <Link
                        to={`/profili/${perdoruesiData._id}/menaxhoShpalljet`}
                        className="flex items-center gap-3 py-2 px-3 hover:text-[#0F4C75] transition-colors"
                        onClick={closeMenu}
                      >
                        <SquareChartGantt
                          size={20}
                          className="text-[#0F4C75]"
                        />
                        Menaxho Shpalljet
                      </Link>
                    ) : (
                      <Link
                        to={`/profili/${perdoruesiData._id}/menaxhoAplikimet`}
                        className="flex items-center gap-3 py-2 px-3 hover:text-[#0F4C75] transition-colors"
                        onClick={closeMenu}
                      >
                        <SquareChartGantt
                          size={20}
                          className="text-[#0F4C75]"
                        />
                        Menaxho Aplikimet
                      </Link>
                    )}

                    <Link
                      to={`/profili/${perdoruesiData._id}/konfigurimet`}
                      className="flex items-center gap-3 py-2 px-3 hover:text-[#0F4C75] transition-colors"
                      onClick={closeMenu}
                    >
                      <Settings size={20} className="text-[#0F4C75]" />
                      Konfigurimet e Llogarise
                    </Link>

                    <Link
                      to={`/profili/${perdoruesiData._id}/punetRuajtura`}
                      className="flex items-center gap-3 py-2 px-3 hover:text-[#0F4C75] transition-colors"
                      onClick={closeMenu}
                    >
                      <Heart size={20} className="text-[#0F4C75]" />
                      Punet e Ruajtura
                    </Link>
                  </div>
                )}

                <button
                  onClick={() => {
                    handleCkycja();
                    closeMenu();
                  }}
                  className="mt-4 bg-red-500 text-white px-4 py-3 rounded-lg font-medium w-full hover:bg-red-600 transition-colors"
                >
                  C'kycu
                </button>
              </div>
            ) : (
              <div className="mt-4 border-t pt-4 flex flex-col gap-3">
                <Link
                  to="/kycja"
                  className="kycja text-center"
                  onClick={closeMenu}
                >
                  Kycu/Regjistrohu
                </Link>
                <Link
                  to="/kycja"
                  className="publikoPune text-center"
                  onClick={closeMenu}
                >
                  Publiko Pune
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

export default Header;
