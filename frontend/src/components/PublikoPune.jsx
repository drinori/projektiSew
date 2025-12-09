import axios from "axios";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function PublikoPune() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pozitaPunes: "",
    kategoriaPunes: "",
    lokacioniPunes: "",
    pershkrimiPunes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let dataToSend = {
      pozitaPunes: formData.pozitaPunes,
      kategoriaPunes: formData.kategoriaPunes,
      lokacioniPunes: formData.lokacioniPunes,
      pershkrimiPunes: formData.pershkrimiPunes,
    };

    const response = await axios.post(
      "http://localhost:3000/api/shpallja/kompania",
      dataToSend,
    );

    if (response.data.success) {
      alert("Puna u shpall");
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
        <button type="submit" className="mx-5 publikoPune">
          Konfirmo
        </button>
      </form>
    </div>
  );
}

export default PublikoPune;
