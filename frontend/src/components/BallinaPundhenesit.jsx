import AplikantiCard from "./AplikantiCard";
import Header from "./Header";
import { useEffect, useState } from "react";
import axios from "axios";

function BallinaPundhenesit() {
  const [aplikantet, setAplikantet] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/aplikantet",
        );
        setAplikantet(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [aplikantet]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans ">
      <Header />
      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-6 md:p-12">
        {aplikantet.map((a) => (
          <div
            key={a._id}
            className="bg-white rounded-xl p-5 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-xl"
          >
            <AplikantiCard aplikanti={a} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BallinaPundhenesit;
