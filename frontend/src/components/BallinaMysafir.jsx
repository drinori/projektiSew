import Header from "./Header";
import Kerkimi from "./Kerkimi";
import { useNavigate } from "react-router-dom";

function BallinaMysafir() {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <Kerkimi />
      <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-[repeat(2,630px)] w-full justify-center gap-6 mt-20">
        <div className="border-gray-300 p-5 shadow-xl">
          <h1 className="text-2xl font-semibold mb-5">Për Punëdhënës</h1>
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quis
            exercitationem, laborum dolor, consequuntur omnis
          </h2>
          <p>Shpall Pune</p>
          <p>Menaxho Shpalljet</p>
          <p>Menaxho Aplikantet</p>
          <button
            type="button"
            className="publikoPune"
            onClick={() => navigate("/regjistrimi")}
          >
            Shiko më shumë
          </button>
        </div>
        <div className="border-gray-300 p-5 shadow-xl">
          <h1 className="text-2xl font-semibold mb-5">Për Aplikantë</h1>
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quis
            exercitationem, laborum dolor, consequuntur omnis
          </h2>
          <p>Apliko për punë</p>
          <p>Menaxho Aplikimet</p>
          <button
            type="button"
            className="publikoPune"
            onClick={() => navigate("/regjistrimi")}
          >
            Shiko më shumë
          </button>
        </div>
      </div>
    </div>
  );
}

export default BallinaMysafir;
