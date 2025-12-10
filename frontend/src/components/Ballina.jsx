import Header from "./Header";
import Kerkimi from "./Kerkimi";
import "../index.css";
import ShpalljaCard from "./ShpalljaCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Ballina() {
  const [shpalljaData, setShpalljaData] = useState([]);

  useEffect(() => {
    const fetchShpalljaData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/shpallja/kompania",
        );
        setShpalljaData(response.data.data || []);
      } catch (err) {
        console.error(err);
        setShpalljaData([]);
      }
    };

    fetchShpalljaData();
  }, []);

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center text-5xl my-15">
        <h1 className="">Gjeni punen perfekte per ju</h1>
      </div>

      <Kerkimi />
      <div className="grid grid-cols-3 place-items-center">
        {shpalljaData.map((shpallja) => {
          return <ShpalljaCard key={shpallja._id} shpallja={shpallja} />;
        })}
      </div>
    </div>
  );
}

export default Ballina;
