import Header from "./Header";
import ShpalljaCard from "./ShpalljaCard";
import "../index.css";
import { useState, useEffect } from "react";
import axios from "axios";

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
      <div className="grid grid-cols-3 place-items-center">
        {shpalljaData.map((shpallja) => {
          return <ShpalljaCard key={shpallja._id} shpallja={shpallja} />;
        })}
      </div>
    </div>
  );
}

export default ListaPuneve;
