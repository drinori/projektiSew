import Header from "./Header";
import ShpalljaCard from "./ShpalljaCard";
import "../index.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Kerkimi from "./Kerkimi";

function ListaPuneve() {
  const [shpalljaData, setShpalljaData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/shpallja/kompania",
        );
        if (response.data.success) {
          const shpalljetAktive = response.data.data.filter(
            (shpallja) => shpallja.status === "aktiv",
          );
          setShpalljaData(shpalljetAktive || []);
        }
      } catch (err) {
        console.error(err);
        setShpalljaData([]);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <Header />
      <h1 className="mt-20">E ardhmja jote fillon këtu</h1>
      <Kerkimi />
      <div className="m-10 md:m-20 lg:m-30">
        <div className="shpalljaCard">
          {shpalljaData.map((shpallja) => {
            return <ShpalljaCard key={shpallja._id} shpallja={shpallja} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default ListaPuneve;
