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
        setShpalljaData(response.data.data || []);
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
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-semi-bold leading-tight mb-15 mt-20">
        E ardhmja jote fillon këtu
      </h1>
      <Kerkimi />
      <div className="m-10 md:m-20 lg:m-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 m-10 md:m-15 lg:m-20">
          {shpalljaData.map((shpallja) => {
            return <ShpalljaCard key={shpallja._id} shpallja={shpallja} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default ListaPuneve;
