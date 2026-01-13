import { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";

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
      {kompanite.map((k) => {
        return (
          <div key={k._id} className="border">
            <p>{k.kompania}</p>
            <p>{k.email}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ListaKompanive;
