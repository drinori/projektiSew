import Header from "./Header";
import Kerkimi from "./Kerkimi";
import ShpalljaCard from "./ShpalljaCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Perdoruesi from "../PerdoruesiContext";
import {
  Search,
  UserPen,
  TrendingUp,
  BookPlus,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

function BallinaMysafir() {
  const navigate = useNavigate();
  const [shpalljaData, setShpalljaData] = useState([]);
  const [kerkoParams] = useSearchParams();

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

  return (
    <div>
      <Header />
      <h1 className="mt-20">Gjeni punen perfekte per ju</h1>

      <Kerkimi />
      <div className="ballinaMysafir">
        <div className="containerballinamysafir">
          <h1 className="text-2xl font-semibold ">Po punësoni talentë?</h1>
          <p className="paragrafBallinaMysafir">
            Lidhu me kandidatë të kualifikuar dhe ndërto ekipin tënd. Publiko
            vende pune brenda pak minutash.
          </p>
          <h2 className="info-ballinaMysafir">
            <BookPlus size={20} />
            Publiko Punë
          </h2>
          <h2 className="info-ballinaMysafir">
            <Users size={20} />
            Rishikoni aplikantët
          </h2>

          <h2 className="info-ballinaMysafir">
            <BriefcaseBusiness size={20} />
            Menaxho Shpalljet
          </h2>
          <button
            type="button"
            className="publikoPune w-full"
            onClick={() => navigate("/kycja")}
          >
            Kycu
          </button>
        </div>
        <div className="containerballinamysafir">
          <h1 className="text-2xl font-semibold m-auto">Po kërkoni punë?</h1>
          <p className="paragrafBallinaMysafir">
            Gjeni mundësi të arta nga kompanit më të mira. Gjej punën e ëndrrave
            sot.
          </p>
          <br />
          <h2 className="info-ballinaMysafir">
            <Search size={20} /> Kërko Punë <br />
          </h2>
          <h2 className="info-ballinaMysafir">
            <UserPen size={20} />
            Ndërto Profilin
          </h2>
          <h2 className="info-ballinaMysafir">
            <TrendingUp size={20} />
            Menaxho Aplikimet
          </h2>
          <button
            type="button"
            className="publikoPune w-full"
            onClick={() => navigate("/kycja")}
          >
            Kycu
          </button>
        </div>
      </div>

      <div className="m-10 md:m-15 lg:m-20">
        <div className="shpalljaCard">
          {shpalljaData.slice(0, 9).map((shpallja) => {
            return <ShpalljaCard key={shpallja._id} shpallja={shpallja} />;
          })}
        </div>

        {shpalljaData.length === 0 && (
          <div className="text-center p-10">
            <p>Nuk ka punë të disponueshme</p>
          </div>
        )}

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
      </div>
    </div>
  );
}

export default BallinaMysafir;
