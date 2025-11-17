import "../App.css";

function Kerkimi() {
  return (
    <div className="kerkimi">
      <form action="">
        <input type="text" placeholder="Kerko" />
        <label htmlFor="qyteti"></label>
        <select name="qyteti">
          <option value="koretin">Koretin</option>
          <option value="kamenica">Kamenica</option>
        </select>
        <select name="kategoria">
          <option value="it">IT</option>
          <option value="ekonomi">Ekonomi</option>
        </select>
        <button type="submit">Kerko</button>
      </form>
    </div>
  );
}

export default Kerkimi;
