import { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import KompaniaCard from "./KompaniaCard";
function ListaKompanive() {
  const [kompanite, setKompanite] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/kompania/kompanite",
        );

        if (response.data.success) {
          setKompanite(response.data.data);
        }
      } catch (error) {
        console.error(error);
        setKompanite([]);
      }
    };

    fetchData();
  }, [kompanite]);

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-[repeat(2,630px)] gap-10 justify-center m-10 sm:12 md:15 lg:20">
        {kompanite.map((k) => {
          return <KompaniaCard key={k._id} kompania={k} />;
        })}
      </div>
    </div>
  );
}

export default ListaKompanive;
