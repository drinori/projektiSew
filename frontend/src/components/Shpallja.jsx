import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBookmark, faClock } from "@fortawesome/free-regular-svg-icons";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Shpallja() {
  const navigate = useNavigate();
  const [shpallja, setShpallja] = useState(null);
  const [perdoruesiData, setPerdoruesiData] = useState({});

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shpallja/${id}`,
        );
        setShpallja(response.data.data);
      } catch (error) {
        console.log("Error:", error);
        setShpallja(null);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  console.log(shpallja);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profili/${id}`,
        );
        setPerdoruesiData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    console.log("perdoruesi: ", perdoruesiData);
  }, [perdoruesiData]);

  if (!perdoruesiData) {
    return (
      <div>
        <Header />
        <div className="text-center p-10">
          <p>Diqka shkoi keq!</p>
        </div>
      </div>
    );
  }

  if (!shpallja) {
    return (
      <div>
        <Header />
        <div className="text-center p-10">
          <p>Diqka shkoi keq!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <h1>{shpallja.emailKompanise}</h1>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-10">
              <nav className="space-y-2">
                <a
                  href="#info-bazike"
                  className="flex items-center p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span>Informacione Bazike</span>
                </a>
                <a
                  href="#pershkrimi"
                  className="flex items-center p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span>Pershkrimi i Punës</span>
                </a>
                <a
                  href="#pergjegjesite"
                  className="flex items-center p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span>Përgjegjësitë</span>
                </a>
                <a
                  href="#kerkesat"
                  className="flex items-center p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span>Kërkesat</span>
                </a>
                <a
                  href="#aplikimi"
                  className="flex items-center p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span>Aplikimi</span>
                </a>
              </nav>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <section id="info-bazike" className="mb-8">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-4xl" />
                    <p className="font-bold text-2xl">{shpallja.pozitaPunes}</p>
                  </div>
                  <FontAwesomeIcon icon={faBookmark} className="text-xl" />
                </div>

                <div className="mt-5"></div>

                <div className="grid grid-cols-3 w-fit gap-4">
                  <p className="info">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    {shpallja.orari}
                  </p>
                  <p className="info">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                    {shpallja.lokacioniPunes}
                  </p>
                  <p className="info">
                    <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                    {shpallja.pagaPrej}-{shpallja.pagaDeri}
                  </p>
                </div>

                <div className="grid grid-cols-2 w-fit gap-6 mb-8 mt-8">
                  <button
                    type="button"
                    className="publikoPune"
                    onClick={() => navigate(`/${id}/aplikimi`)}
                  >
                    Apliko
                  </button>
                  <button
                    type="button"
                    className="border border-gray-400 rounded-lg py-2 px-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Ngarko CV
                  </button>
                </div>

                <div className="border border-gray-300 rounded-lg p-3 grid grid-cols-5 gap-2 items-center mt-4 mb-4">
                  <div className="text-center">
                    <p className="font-medium text-gray-700">Eksperienca</p>
                    <p className="text-lg font-bold mt-1">
                      {shpallja.eksperienca}
                    </p>
                  </div>

                  <div className="h-8 w-px bg-gray-400 mx-auto"></div>

                  <div className="text-center">
                    <p className="font-medium text-gray-700">Aplikante</p>
                    <p className="text-lg font-bold mt-1">
                      {shpallja.numriAplikimeve}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-gray-400 mx-auto"></div>

                  <div className="text-center">
                    <p className="font-medium text-gray-700">Niveli</p>
                    <p className="text-lg font-bold mt-1">
                      {shpallja.niveliPunes}
                    </p>
                  </div>
                </div>
              </section>

              <section
                id="pershkrimi"
                className="mb-8 pt-8 border-t border-gray-200"
              >
                <h1 className="text-xl font-bold mb-3">Pershkrimi i Punës</h1>
                <p className="text-gray-700 leading-relaxed">
                  {shpallja.pershkrimiPunes}
                </p>
              </section>

              <section
                id="pergjegjesite"
                className="mb-8 pt-8 border-t border-gray-200"
              >
                <h1 className="text-xl font-bold mb-3">Përgjegjësitë</h1>
                {shpallja.pyetjet && shpallja.pyetjet.length > 0 ? (
                  <ul className="space-y-2">
                    {shpallja.pyetjet.map((pyetja, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gray-700 mr-3">•</span>
                        <span className="text-gray-700">{pyetja}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    Nuk ka përgjegjësi të specifikuara.
                  </p>
                )}
              </section>
              <section
                id="kerkesat"
                className="mb-8 pt-8 border-t border-gray-200"
              >
                <h1 className="text-xl font-bold mb-3">
                  Kualifikimet e kërkuara
                </h1>
                {shpallja.kualifikimet && shpallja.kualifikimet.length > 0 ? (
                  <ul className="space-y-2">
                    {shpallja.kualifikimet.map((kerkesa, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gray-700 mr-3">•</span>
                        <span className="text-gray-700">{kerkesa}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    Nuk ka kualifikme të specifikuara.
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Shpallja;
