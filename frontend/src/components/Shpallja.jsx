import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAmazon } from "@fortawesome/free-brands-svg-icons";
import { faBookmark, faClock } from "@fortawesome/free-regular-svg-icons";
import Header from "./Header";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Shpallja() {
  const [shpallja, setShpallja] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shpallja/${id}`,
        );
        setShpallja(response.data.data);
      } catch (error) {
        console.log("Error:", error);
        setShpallja([]);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!shpallja) {
    return (
      <div>
        <Header />
        <div className="text-center p-10">
          <p>Diqka shkoi keq!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="relative grid grid-cols-2 place-items-center">
        <div className="bg-[#E3E3E3] w-7xl my-2 rounded-2xl col-span-2">
          <div className="flex justify-around gap-100 my-20 max-w-7xl">
            <div>
              <div className="grid grid-cols-4 grid-rows-2">
                <div className="flex row-span-2 items-center justify-start">
                  <FontAwesomeIcon
                    icon={faAmazon}
                    className="text-5xl self-center"
                  />
                </div>
                <p className="font-bold text-2xl">{shpallja.pozitaPunes}</p>
                <p className="-col-4">
                  <FontAwesomeIcon icon={faBriefcase} />
                  {shpallja.kategoriaPunes.toUpperCase()}
                </p>
                <p>
                  <FontAwesomeIcon icon={faLocationDot} />
                  {shpallja.lokacioniPunes}
                </p>
                <p>
                  <FontAwesomeIcon icon={faClock} />
                  Data
                </p>
              </div>
            </div>
            <FontAwesomeIcon icon={faBookmark} className="text-xl" />
          </div>
        </div>
        <p className="top-20 max-w-xl">{shpallja.pershkrimiPunes}</p>
      </div>
    </div>
  );
}

export default Shpallja;
