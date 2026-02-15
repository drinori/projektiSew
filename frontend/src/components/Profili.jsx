import "../index.css";
import Header from "./Header";
import Perdoruesi from "../PerdoruesiContext";
import ProfiliAplikantit from "./ProfiliAplikantit";
import ProfiliKompanise from "./ProfiliKompanise";

function Profili() {
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-[#F7FBFC] via-[#D6E6F2] to-[#B9D7EA] backdrop-blur-2xl">
      <Header />
      {perdoruesiData?.tipiPerdoruesit === "aplikant" ? (
        <ProfiliAplikantit />
      ) : (
        <ProfiliKompanise />
      )}
    </div>
  );
}

export default Profili;
