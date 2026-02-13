import AplikantiCard from "./AplikantiCard";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Search, CircleCheck, MessageCircleMore } from "lucide-react";
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

  const filteredAplikantet = aplikantet.filter(
    (a) =>
      a.emri?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-[#F7FBFC] min-h-screen font-sans">
      {/* Hero Section profesional */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#F7FBFC] via-[#D6E6F2] to-[#B9D7EA] backdrop-blur-2xl">
        <Header />

        {/* Forme dekorative subtile */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#769FCD]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0F4C75]/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl md:text-5xl mb-6 leading-tight text-primary font-bold text-left">
                Menaxho kandidatët dhe gjej profesionistët e duhur
              </h1>
              <p className="text-xl text-[#6D94C5] mb-8 leading-relaxed">
                Platforma profesionale për të eksploruar, vlerësuar dhe
                kontaktuar kandidatët më të mirë për ekipin tuaj.
              </p>

              {/* Statistika */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-[#D6E6F2]">
                  <div className="text-3xl font-bold text-[#0F4C75]">
                    {aplikantet.length}
                  </div>
                  <div className="text-sm mt-1 text-[#6D94C5]">
                    Kandidatë aktivë
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-[#D6E6F2]">
                  <div className="text-3xl font-bold text-[#0F4C75]">100%</div>
                  <div className="text-sm mt-1 text-[#6D94C5]">
                    Të verifikuar
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-[#D6E6F2]">
                  <div className="text-3xl font-bold text-[#0F4C75]">
                    Shpejt
                  </div>
                  <div className="text-sm mt-1 text-[#6D94C5]">Përgjigje</div>
                </div>
              </div>
            </div>

            {/* Ilustrim i djathtë */}
            <div className="hidden lg:block flex-1">
              <div className="relative">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#D6E6F2]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4  rounded-xl p-4 transition-all">
                      <div className="text-white w-12 h-12 bg-[#0F4C75] rounded-lg flex items-center justify-center">
                        <CircleCheck />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F4C75]">
                          Profile të plota
                        </div>
                        <div className="text-sm text-[#6D94C5]">
                          CV dhe dokumentacione
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4  rounded-xl p-4 ">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Search />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F4C75]">
                          Kërkim i avancuar
                        </div>
                        <div className="text-sm text-[#6D94C5]">
                          Filtro sipas kritereve
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4  rounded-xl p-4 ">
                      <div className="text-white w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <MessageCircleMore />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F4C75]">
                          Komunikim direkt
                        </div>
                        <div className="text-sm text-[#6D94C5]">
                          Kontakto kandidatët
                        </div>
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
      <div className="mx-10 my-5 rounded-lg sticky top-0 z-20 bg-white/55 backdrop-blur-lg border-b border-[#F7FBFC] shadow-sm">
        <div className=" mx-auto px-6 md:px-12 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Search bar */}
            <div className="relative flex-1 max-w-2xl ">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-[#6D94C5]" />
              </div>
              <input
                type="text"
                placeholder="Kërko kandidatë sipas emrit, emailit ose pozicionit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#D6E6F2] focus:border-[#769FCD] focus:ring-2 focus:ring-[#B9D7EA]/30 transition-all outline-none text-[#0F4C75] bg-white placeholder:text-[#6D94C5]/60"
              />
            </div>

            {/* Filtrat */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterActive("te-gjithe")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  filterActive === "te-gjithe"
                    ? "bg-primary text-white shadow-lg "
                    : "bg-white text-primary hover:bg-primary hover:text-white border border-[#769FCD]"
                }`}
              >
                Të gjithë
              </button>
              <button
                onClick={() => setFilterActive("te-rinj")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  filterActive === "te-rinj"
                    ? "bg-primary text-white shadow-lg "
                    : "bg-white text-primary hover:bg-primary hover:text-white border border-[#769FCD]"
                }`}
              >
                Të rinjtë
              </button>
              <button
                onClick={() => setFilterActive("te-preferuar")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  filterActive === "te-preferuar"
                    ? "bg-primary text-white shadow-lg "
                    : "bg-white text-primary hover:bg-primary hover:text-white border border-[#769FCD]"
                }`}
              >
                Të preferuar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Header me sort options */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F4C75] mb-1">
              Kandidatët e disponueshëm
            </h2>
            <p className="text-sm text-[#6D94C5]">
              {filteredAplikantet.length}{" "}
              {filteredAplikantet.length === 1 ? "rezultat" : "rezultate"}
            </p>
          </div>

          <select className="px-4 py-2.5 rounded-lg border border-[#D6E6F2] focus:border-[#769FCD] focus:ring-2 focus:ring-[#B9D7EA]/30 outline-none bg-white font-medium text-[#0F4C75]">
            <option>Rendit sipas: Më të rinjtë</option>
            <option>Rendit sipas: Më të vjetrit</option>
            <option>Rendit sipas: Emrit (A-Z)</option>
            <option>Rendit sipas: Emrit (Z-A)</option>
          </select>
        </div>

        {/* Grid i aplikantëve */}
        {filteredAplikantet.length > 0 ? (
          <div className="rounded-2xl grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAplikantet.map((a, index) => (
              <div
                key={a._id}
                className="bg-white/60 rounded-2xl shadow-lg transition-colors duration-200 "
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`,
                }}
              >
                <AplikantiCard aplikanti={a} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#D6E6F2]">
            <svg
              className="w-16 h-16 mx-auto text-[#B9D7EA] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-[#0F4C75] mb-2">
              Nuk u gjetën rezultate
            </h3>
            <p className="text-[#6D94C5]">
              Provo të kërkosh me terma të tjerë ose ndryshoje filtrin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BallinaPundhenesit;
