import Header from "./Header";
import Kerkimi from "./Kerkimi";
import "../index.css";
import ShpalljaCard from "./ShpalljaCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Perdoruesi from "../PerdoruesiContext";
import BallinaPundhenesit from "./BallinaPundhenesit";
import { useNavigate } from "react-router-dom";

function Ballina() {
  const navigate = useNavigate();
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();
  const [shpalljaData, setShpalljaData] = useState([]);
  const [kerkoParams] = useSearchParams();

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
            console.error("Gabim ne kerkim:  ", response.data.error);
          }
        } else {
          const response = await axios.get(
            "http://localhost:3000/api/shpallja/kompania",
          );
          if (response.data.success) {
            const shpalljetAktive = response.data.data.filter(
              (shpallja) => shpallja.status === "aktiv",
            );
            setShpalljaData(shpalljetAktive || []);
          }
        }
      } catch (err) {
        console.error(err);
        setShpalljaData([]);
      }
    };

    fetchData();
  }, [kerkoParams]);

  useEffect(() => {
    console.log(perdoruesiData);
  }, [perdoruesiData]);

  return (
    <div>
      {perdoruesiData?.tipiPerdoruesit === "punedhenes" ? (
        <>
          <BallinaPundhenesit />
        </>
      ) : (
        <>
          <Header />

          <div className="flex justify-center items-center px-4 my-8 md:my-12 lg:my-15">
            <h1>Gjeni punen perfekte per ju</h1>
          </div>

          <Kerkimi />
          <div className="shpalljaCard">
            {shpalljaData.slice(0, 9).map((shpallja) => {
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
            )}
          </div>
          {shpalljaData.length > 9 && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                className="publikoPune px-8 py-3"
                onClick={() => navigate("/ListaPuneve")}
              >
                Shfaq më shumë
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Ballina;
