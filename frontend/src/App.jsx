import { BrowserRouter, Routes, Route } from "react-router-dom";
import Ballina from "./components/Ballina";
import ListaPuneve from "./components/ListaPuneve";
import "./index.css";
import ListaKompanive from "./components/ListaKompanive";
import RrethNesh from "./components/RrethNesh";
import Kycja from "./components/Kycja";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ballina />} />
        <Route path="/listaPuneve" element={<ListaPuneve />} />
        <Route path="/listaKompanive" element={<ListaKompanive />} />
        <Route path="/rrethNesh" element={<RrethNesh />} />
        <Route path="/kycja" element={<Kycja />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
