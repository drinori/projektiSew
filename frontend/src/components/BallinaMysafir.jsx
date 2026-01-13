import Header from "./Header";
import Kerkimi from "./Kerkimi";
import { useNavigate } from "react-router-dom";

function BallinaMysafir() {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <Kerkimi />
      <div className="flex justify-between gap-6 m-10">
        <div className="border p-5">
          <h1>Punedhenes</h1>
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
            Kliko
          </button>
        </div>
        <div className="border p-5">
          <h1>Aplikante</h1>
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
            Kliko
          </button>
        </div>
      </div>
    </div>
  );
}

export default BallinaMysafir;
