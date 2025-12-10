import axios from "axios";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function PublikoPune() {
  const navigate = useNavigate();
  const [pyetjet, setPyetjet] = useState([]);
  const [pyetjaTanishme, setPyetjaTanishme] = useState("");
  const [formData, setFormData] = useState({
    pozitaPunes: "",
    kategoriaPunes: "",
    lokacioniPunes: "",
    pershkrimiPunes: "",
  });

  const shtoPyetjen = () => {
    if (pyetjaTanishme.trim()) {
      setPyetjet([...pyetjet, pyetjaTanishme]);
      setPyetjaTanishme("");
    }
  };

  const fshijPyetjen = (index) => {
    const pyetjetReja = pyetjet.filter((_, i) => i !== index);
    setPyetjet(pyetjetReja);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let dataToSend = {
      pozitaPunes: formData.pozitaPunes,
      kategoriaPunes: formData.kategoriaPunes,
      lokacioniPunes: formData.lokacioniPunes,
      pershkrimiPunes: formData.pershkrimiPunes,
      pyetjet: pyetjet,
    };

    const response = await axios.post(
      "http://localhost:3000/api/shpallja/kompania",
      dataToSend,
    );

    if (response.data.success) {
      alert("Puna u shpall");

      setFormData({
        pozitaPunes: "",
        kategoriaPunes: "",
        lokacioniPunes: "",
        pershkrimiPunes: "",
      });
      setPyetjet([]);
      setPyetjaTanishme("");
    }

    navigate("/");
  };

  return (
    <div>
      <Link to="/" className="underline text-blue-600">
        Ballina
      </Link>

      <form onSubmit={handleSubmit}>
        <label htmlFor="pozitaPunes"> </label>
        <input
          className="border"
          type="text"
          id="pozitaPunes"
          placeholder="Sheno Poziten e Punes"
          onChange={(e) =>
            setFormData({ ...formData, pozitaPunes: e.target.value })
          }
        />
        <label htmlFor="kategoriaPunes"> </label>
        <select
          id="kategoriaPunes"
          className="border"
          value={formData.kategoriaPunes}
          onChange={(e) =>
            setFormData({ ...formData, kategoriaPunes: e.target.value })
          }
        >
          <option value="" disabled>
            Kategoria
          </option>
          <option value="administrate">Administrate</option>
          <option value="it">IT</option>
        </select>
        <label htmlFor="lokacioniPunes"> </label>
        <input
          className="border"
          type="text"
          id="lokacioniPunes"
          placeholder="Sheno Lokacionin e Punes"
          onChange={(e) =>
            setFormData({ ...formData, lokacioniPunes: e.target.value })
          }
        />
        <label htmlFor="pershkrimiPunes"></label>
        <textarea
          id="pershkrimiPunes"
          rows="5"
          cols="40"
          className="border mx-5"
          placeholder="Pershkrimi Punes"
          onChange={(e) =>
            setFormData({ ...formData, pershkrimiPunes: e.target.value })
          }
        ></textarea>
        <div>
          <label htmlFor="pyetja"></label>
          <input
            type="text"
            placeholder="Sheno pyetjen"
            className="border"
            value={pyetjaTanishme}
            onChange={(e) => setPyetjaTanishme(e.target.value)}
          />

          <button
            type="button"
            className="cursor-pointer mx-5 publikoPune !bg-green-400"
            onClick={() => shtoPyetjen()}
          >
            Shto Pyetje
          </button>
        </div>
        <div>
          {pyetjet.length > 0 && <h4>Pyetjet e shtuara: </h4>}
          {pyetjet.map((pyetja, i) => {
            return (
              <div key={i}>
                {pyetja}
                <button
                  type="button"
                  className="cursor-pointer mx-5 publikoPune !bg-red-400"
                  onClick={() => fshijPyetjen(i)}
                >
                  Fshij Pyetjen
                </button>
              </div>
            );
          })}
        </div>
        <button type="submit" className="mx-5 publikoPune">
          Konfirmo
        </button>
      </form>
    </div>
  );
}

export default PublikoPune;
