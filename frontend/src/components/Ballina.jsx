import Header from "./Header";
import Kerkimi from "./Kerkimi";
import "../index.css";
import ShpalljaCard from "./ShpalljaCard";

function Ballina() {
  return (
    <div>
      <Header />
      <div className="flex justify-center items-center text-5xl my-15">
        <h1 className="">Gjeni punen perfekte per ju</h1>
      </div>

      <Kerkimi />
      <ShpalljaCard />
    </div>
  );
}

export default Ballina;
