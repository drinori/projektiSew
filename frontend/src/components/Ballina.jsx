import Header from "./Header";
import { Link } from "react-router-dom";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import Kerkimi from "./Kerkimi";
import "../index.css";
import ShpalljaCard from "./ShpalljaCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PublikoPune from "./PublikoPune";

function Ballina() {
  const [shpalljaData, setShpalljaData] = useState([]);
  const [perdoruesiData, setPerdoruesiData] = useState(null);
  const [kerkoParams] = useSearchParams();

  const handleCkycja = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/ckycja/perdoruesi",
        {},
        { withCredentials: true },
      );

      setPerdoruesiData(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      console.log("Ckycja u be", response.data);
    } catch (error) {
      console.error(error);
      setPerdoruesiData(null);
      localStorage.clear();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(kerkoParams);

        if (params.toString()) {
          const response = await axios.get(
            `http://localhost:3000/api/shpallja/kerko?${params.toString()}`,
          );
          if (response.data.success) {
            setShpalljaData(response.data.data || []);
          } else {
            console.error("Gabim ne kerkim: ", response.data.error);
          }
        } else {
          const response = await axios.get(
            "http://localhost:3000/api/shpallja/kompania",
          );
          setShpalljaData(response.data.data || []);
        }
      } catch (err) {
        console.error(err);
        setShpalljaData([]);
      }
    };

    fetchData();
  }, [kerkoParams]);

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
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPerdoruesiData();
  }, [perdoruesiData]);

  return (
    <div>
      {perdoruesiData?.tipiPerdoruesit === "punedhenes" ? (
        <>
          <div className="flex justify-between bg-white shadow-md py-7 px-6 mx-auto flex justify-between items-center ml-auto text-l rounded-2xl">
            <Header />
            <div className="flex space-x-4 ml-auto items-center">
              <Link to="/profili">
                {perdoruesiData.emri ? (
                  <FontAwesomeIcon icon={faUser} />
                ) : (
                  <FontAwesomeIcon icon={faBriefcase} />
                )}
                {perdoruesiData.emri || perdoruesiData.kompania}
              </Link>
              <button
                type="button"
                className="cursor-pointer publikoPune bg-red-500!"
                onClick={handleCkycja}
              >
                C'kycu
              </button>
            </div>
          </div>
          <PublikoPune />
        </>
      ) : (
        <>
          <div className="flex justify-between bg-white shadow-md py-7 px-6 mx-auto flex justify-between items-center ml-auto text-l rounded-2xl">
            <Header />

            {perdoruesiData ? (
              <div className="flex space-x-4 ml-auto items-center">
                <Link to="/profili">
                  {perdoruesiData.emri ? (
                    <FontAwesomeIcon icon={faUser} />
                  ) : (
                    <FontAwesomeIcon icon={faBriefcase} />
                  )}
                  {perdoruesiData.emri || perdoruesiData.kompania}
                </Link>
                <button
                  type="button"
                  className="cursor-pointer publikoPune bg-red-500!"
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

          <div className="flex justify-center items-center text-5xl my-15">
            <h1 className="">
              Gjeni punen perfekte per ju{" "}
              {perdoruesiData?.emri || perdoruesiData?.kompania}
            </h1>
          </div>

          <Kerkimi />
          <div className="grid grid-cols-3 place-items-center">
            {shpalljaData.map((shpallja) => {
              return <ShpalljaCard key={shpallja._id} shpallja={shpallja} />;
            })}
            {shpalljaData.length === 0 && (
              <div className="text-center p-10">
                <p>
                  {kerkoParams.toString()
                    ? "Nuk u gjet asnjë punë me këto kërkime"
                    : "Nuk ka punë të disponueshme"}
                </p>
              </div>
            )}{" "}
          </div>
        </>
      )}
    </div>
  );
}

export default Ballina;
