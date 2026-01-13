import Header from "./Header";
import { useNavigate } from "react-router-dom";

function BallinaMysafir() {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div className="flex justify-evenly">
        <div className="border">
          <h1>Punedhenes</h1>
          <p>TEST</p>
          <p>TEST</p>
          <p>TEST</p>
          <button type="button" onClick={() => navigate("/kycja")}>
            Kliko
          </button>
        </div>
        <div className="border">
          <h1>Kerkoni pune</h1>
          <p>TEST</p>
          <p>TEST</p>
          <p>TEST</p>
          <button type="button" onClick={() => navigate("/kycja")}>
            Kliko
          </button>
        </div>
      </div>
    </div>
  );
}

export default BallinaMysafir;
