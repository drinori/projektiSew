import axios from "axios";
import { useEffect, useState } from "react";
import Header from "./Header";
import AplikantiCard from "./AplikantiCard";

function ListaAplikanteve() {
  const [aplikantet, setAplikantet] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/aplikantet/",
        );
        if (response.data.success) {
          setAplikantet(response.data.data);
        }
      } catch (error) {
        console.error(error);
        setAplikantet([]);
      }
    };

    fetchData();
  }, [aplikantet]);

  if (aplikantet.length === 0) {
    return <div>error</div>;
  }

  return (
    <div>
      <Header />
      {aplikantet.map((a) => {
        return <AplikantiCard key={a._id} aplikanti={a} />;
      })}
    </div>
  );
}

export default ListaAplikanteve;
