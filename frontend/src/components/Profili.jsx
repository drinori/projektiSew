import "../index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Perdoruesi from "../PerdoruesiContext";
import ProfiliAplikantit from "./ProfiliAplikantit";
import ProfiliKompanise from "./ProfiliKompanise";

function Profili() {
  const navigate = useNavigate();
  const { perdoruesiData, setPerdoruesiData } = Perdoruesi.usePerdoruesi();

  const handleCkycja = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/ckycja/perdoruesi",
        {},
      );
      setPerdoruesiData(null);
      console.log("Ckycja u be", response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setPerdoruesiData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header perdoruesiData={perdoruesiData} onCkycja={handleCkycja} />
      {perdoruesiData?.tipiPerdoruesit === "aplikant" ? (
        <ProfiliAplikantit />
      ) : (
        <ProfiliKompanise />
      )}
    </div>
  );
}

export default Profili;
