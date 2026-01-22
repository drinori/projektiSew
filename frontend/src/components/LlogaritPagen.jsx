import { useState } from "react";
import "../index.css";

function LlogaritPagen() {
  const [punaDhënesi, setPunaDhënesi] = useState("Primar");
  const [bruto, setBruto] = useState("");
  const [kontributPunëtor, setKontributPunëtor] = useState("5");
  const [kontributPunëdhënes, setKontributPunëdhënes] = useState("5");
  const [rezultati, setRezultati] = useState(null);

  const handleBrutoChange = (e) => {
    let value = e.target.value;
    // Heq të gjitha karakteret që nuk janë numra ose pikë dhjetore
    value = value.replace(/[^0-9.]/g, '');
    // Heq zero të tepërta në fillim
    value = value.replace(/^0+(?=\d)/, '');
    setBruto(value);
  };

  const handleKontributPunëtorChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, '');
    value = value.replace(/^0+(?=\d)/, '');
    // Kufizo në 5-15%
    if (value === "" || (parseFloat(value) >= 5 && parseFloat(value) <= 15)) {
      setKontributPunëtor(value);
    }
  };

  const handleKontributPunëdhënesChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, '');
    value = value.replace(/^0+(?=\d)/, '');
    // Kufizo në 5-15%
    if (value === "" || (parseFloat(value) >= 5 && parseFloat(value) <= 15)) {
      setKontributPunëdhënes(value);
    }
  };

  const llogarit = () => {
    const brutoNum = parseFloat(bruto) || 0;
    const kontributPunëtorNum = parseFloat(kontributPunëtor) || 5;
    const kontributPunëdhënesNum = parseFloat(kontributPunëdhënes) || 5;
    
    const kontributPunëtorVlera = brutoNum * (kontributPunëtorNum / 100);
    const kontributPunëdhënesVlera = brutoNum * (kontributPunëdhënesNum / 100);
    const kontributetTotal = kontributPunëtorVlera + kontributPunëdhënesVlera;
    
    const pagaTatuese = brutoNum - kontributPunëtorVlera;

    let tatimi = 0;
    let tatimi0_80 = 0;
    let tatimi80_250 = 0;
    let tatimi250_450 = 0;
    let tatimiMbi450 = 0;

    if (pagaTatuese > 450) {
      tatimiMbi450 = (pagaTatuese - 450) * 0.1;
      tatimi250_450 = 200 * 0.08;
      tatimi80_250 = 170 * 0.04;
      tatimi = tatimiMbi450 + tatimi250_450 + tatimi80_250;
    } else if (pagaTatuese > 250) {
      tatimi250_450 = (pagaTatuese - 250) * 0.08;
      tatimi80_250 = 170 * 0.04;
      tatimi = tatimi250_450 + tatimi80_250;
    } else if (pagaTatuese > 80) {
      tatimi80_250 = (pagaTatuese - 80) * 0.04;
      tatimi = tatimi80_250;
    }

    const neto = brutoNum - kontributPunëtorVlera - tatimi;

    setRezultati({
      kontributPunëtorVlera,
      kontributPunëdhënesVlera,
      kontributetTotal,
      pagaTatuese,
      tatimi,
      neto,
      tatimi0_80,
      tatimi80_250,
      tatimi250_450,
      tatimiMbi450
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Llogaritja e pagës nga BRUTO NË NETO 
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-8 space-y-8">
        {/* Punëdhënësi */}
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-gray-800">
            Punëdhënësi *
          </label>
          <select
            value={punaDhënesi}
            onChange={(e) => setPunaDhënesi(e.target.value)}
            className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          >
            <option value="Primar">Primar</option>
            <option value="Privat">Privat</option>
            <option value="Publik">Publik</option>
          </select>
        </div>

        {/* Paga BRUTO */}
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-gray-800">
            Paga BRUTO *
          </label>
          <div className="relative">
            <input
              type="text"
              value={bruto}
              onChange={handleBrutoChange}
              className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all pr-12"
              placeholder="Shkruaj pagen bruto"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
              €
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 my-8"></div>

        {/* Kontributet pensionale */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-gray-900">Kontributet pensionale</h3>
          
          {/* Kontributi i punëtorit */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Kontributi i punëtorit % *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={kontributPunëtor}
                  onChange={handleKontributPunëtorChange}
                  className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all pr-12"
                  placeholder="5"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                  %
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Shenoni përqindjen e kontributit në barrë të punëtorit në shifra (p.sh. për 5% shenoni 5). 
                Kontributi pensional duhet të jetë prej 5% -15%, kurse për shtetasit e huaj nuk llogaritet.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">Gjithsej kontributi i punëtorit</span>
                <span className="text-xl font-bold text-blue-600">
                  {rezultati ? `${rezultati.kontributPunëtorVlera.toFixed(2)} €` : "0.00 €"}
                </span>
              </div>
            </div>
          </div>

          {/* Kontributi i punëdhënësit */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Kontributi i punëdhënësit % *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={kontributPunëdhënes}
                  onChange={handleKontributPunëdhënesChange}
                  className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all pr-12"
                  placeholder="5"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                  %
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Shenoni përqindjen e kontributit në barrë të punëdhënësit në shifra (p.sh. për 5% shenoni 5). 
                Kontributi pensional duhet të jetë prej 5% -15%, kurse për shtetasit e huaj nuk llogaritet.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">Gjithsej kontributi i punëdhënësit</span>
                <span className="text-xl font-bold text-blue-600">
                  {rezultati ? `${rezultati.kontributPunëdhënesVlera.toFixed(2)} €` : "0.00 €"}
                </span>
              </div>
            </div>
          </div>

          {/* Gjithsej kontributet */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Gjithsej kontributet</span>
              <span className="text-2xl font-bold text-blue-700">
                {rezultati ? `${rezultati.kontributetTotal.toFixed(2)} €` : "0.00 €"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={llogarit}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 text-xl font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
        >
          Llogarit pagën
        </button>

        {rezultati && (
          <div className="mt-8 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl space-y-8 border-2 border-blue-100">
            {/* Paga që tatohet */}
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-gray-800">Paga që tatohet</h4>
              <div className="text-3xl font-bold text-blue-600">
                {rezultati.pagaTatuese.toFixed(2)} €
              </div>
            </div>

            {/* Shkallët tatimore */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Shkallët tatimore:</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-700">Paga prej 0-80 €</span>
                  <span className="text-lg font-bold text-gray-900">{rezultati.tatimi0_80.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-700">Paga prej 80-250 €</span>
                  <span className="text-lg font-bold text-gray-900">{rezultati.tatimi80_250.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-700">Paga prej 250-450 €</span>
                  <span className="text-lg font-bold text-gray-900">{rezultati.tatimi250_450.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-700">Paga mbi 450 €</span>
                  <span className="text-lg font-bold text-gray-900">{rezultati.tatimiMbi450.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Gjithsej tatimi dhe NETO */}
            <div className="pt-6 border-t-2 border-gray-300 space-y-6">
              <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow">
                <span className="text-xl font-bold text-gray-800">Gjithsej tatimi</span>
                <span className="text-2xl font-bold text-red-600">{rezultati.tatimi.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                <span className="text-2xl font-bold">Paga NETO</span>
                <span className="text-3xl font-bold">{rezultati.neto.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LlogaritPagen;