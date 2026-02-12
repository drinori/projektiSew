import AplikantiCard from "./AplikantiCard";
import Header from "./Header";
import { useEffect, useState } from "react";
import axios from "axios";

function BallinaPundhenesit() {
  const [aplikantet, setAplikantet] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("te-gjithe");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/aplikantet",
        );
        setAplikantet(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const filteredAplikantet = aplikantet.filter((a) =>
    a.emri?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      
      {/* Hero Section profesional */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[769FCD] to-[#B9D7EA]">
        {/* Forme dekorative subtile */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <div className="inline-block bg-blue-400 rounded-lg px-4 py-2 mb-6">
                <span className="text-sm font-semibold">Paneli i Menaxhimit</span>
              </div>
              <h1 className="text-4xl md:text-5xl mb-6 leading-tight">
                Menaxho kandidatët dhe gjej profesionistët e duhur
              </h1>
              <p className="text-xl  mb-8 leading-relaxed">
                Platforma profesionale për të eksploruar, vlerësuar dhe kontaktuar kandidatët më të mirë për ekipin tuaj.
              </p>
              
              {/* Statistika */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10">
                  <div className="text-3xl font-bold text-blue-400">{aplikantet.length}</div>
                  <div className="text-sm mt-1">Kandidatë aktivë</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10">
                  <div className="text-3xl font-bold text-blue-400">100%</div>
                  <div className="text-sm mt-1">Të verifikuar</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10">
                  <div className="text-3xl font-bold text-blue-400">Fast</div>
                  <div className="text-sm mt-1">Përgjigje</div>
                </div>
              </div>
            </div>

            {/* Ilustrim i djathtë */}
            <div className="hidden lg:block flex-1">
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Profile të plota</div>
                        <div className="text-sm text-gray-600">CV dhe dokumentacione</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Kërkim i avancuar</div>
                        <div className="text-sm text-gray-600">Filtro sipas kritereve</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Komunikim direkt</div>
                        <div className="text-sm text-gray-600">Kontakto kandidatët</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kërkim dhe filtra */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search bar */}
            <div className="relative flex-1 max-w-2xl w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Kërko kandidatë sipas emrit, emailit ose pozicionit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 bg-white"
              />
            </div>

            {/* Filtrat */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterActive("te-gjithe")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  filterActive === "te-gjithe"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Të gjithë
              </button>
              <button
                onClick={() => setFilterActive("te-rinj")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  filterActive === "te-rinj"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Të rinjtë
              </button>
              <button
                onClick={() => setFilterActive("te-preferuar")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  filterActive === "te-preferuar"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Të preferuar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seksioni i aplikantëve */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Header me sort options */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Kandidatët e disponueshëm
            </h2>
            <p className="text-gray-600">
              {filteredAplikantet.length} {filteredAplikantet.length === 1 ? 'rezultat' : 'rezultate'}
            </p>
          </div>
          
          <select className="px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium text-gray-700">
            <option>Rendit sipas: Më të rinjtë</option>
            <option>Rendit sipas: Më të vjetrit</option>
            <option>Rendit sipas: Emrit (A-Z)</option>
            <option>Rendit sipas: Emrit (Z-A)</option>
          </select>
        </div>

        {/* Grid i aplikantëve */}
        {filteredAplikantet.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAplikantet.map((a, index) => (
              <div
                key={a._id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-blue-300"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`
                }}
              >
                <AplikantiCard aplikanti={a} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nuk u gjetën rezultate
            </h3>
            <p className="text-gray-600">
              Provo të kërkosh me terma të tjerë ose ndryshoje filtrin
            </p>
          </div>
        )}
      </div>

      {/* Footer section */}
      <div className="bg-slate-800 text-white py-12 mt-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ke pyetje ose ke nevojë për asistencë?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Ekipi ynë është i gatshëm të të ndihmojë në çdo hap të procesit të rekrutimit
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg">
              Kontakto mbështetjen
            </button>
            <button className="bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all border border-slate-600">
              Shiko dokumentacionin
            </button>
          </div>
        </div>
      </div>

      {/* CSS për animacionet */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default BallinaPundhenesit;