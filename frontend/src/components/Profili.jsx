import { useState, useEffect } from "react";
import "../index.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import {
  Mail,
  Phone,
  Briefcase,
  Plus,
  GraduationCap,
  FolderKanban,
  Edit2,
} from "lucide-react";

function Profili() {
  const navigate = useNavigate();
  const [perdoruesiData, setPerdoruesiData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profili/${id}`,
        );
        setPerdoruesiData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    console.log("perdoruesi: ", perdoruesiData);
  }, [perdoruesiData]);

  const handleCkycja = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/ckycja/perdoruesi",
        {},
        { withCredentials: true },
      );
      setPerdoruesiData(null);
      console.log("Ckycja u be", response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setPerdoruesiData(null);
    }
  };

  const getInitials = () => {
    if (perdoruesiData?.emri && perdoruesiData?.mbiemri) {
      return `${perdoruesiData.emri[0]}${perdoruesiData.mbiemri[0]}`.toUpperCase();
    } else if (perdoruesiData?.kompania) {
      return perdoruesiData.kompania.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header perdoruesiData={perdoruesiData} onCkycja={handleCkycja} />

      <div className="max-w-4xl mx-auto mb-2 mt-10">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-32 bg-white/30 "></div>

          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-black text-4xl font-bold shadow-xl border-4 border-blue-100">
                {getInitials()}
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {perdoruesiData?.emri || perdoruesiData?.kompania}{" "}
                  {perdoruesiData?.mbiemri}
                </h1>

                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 mt-4">
                  <Mail size={16} />
                  {perdoruesiData.email}
                </p>
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2">
                  <Phone size={16} />
                  {perdoruesiData.nrTelefonit}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Eksperienca  */}
      <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-4xl mx-auto ">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Briefcase size={24} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Eksperienca
                </h2>
              </div>
              <button className="publikoPune flex items-center gap-1">
                <Plus size={18} />
                Shto
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <input
                type="text"
                placeholder="Titulli i pozicionit"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Kompania"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Data fillimit"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Data mbarimit"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="Përshkrimi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              <div className="flex gap-2">
                <button className="publikoPune">Ruaj</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Anulo
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6 mt-10">
              <div className="flex items-center gap-2 ">
                <GraduationCap size={24} />
                <h2 className="text-2xl font-bold text-gray-900  ">Edukimi</h2>
              </div>
              <button className="publikoPune flex items-center gap-1">
                <Plus size={18} />
                Shto
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <input
                type="text"
                placeholder="Diploma/Titulli"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Institucioni"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  placeholder="Data fillimit"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  placeholder="Data mbarimit"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="Përshkrimi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              <div className="flex gap-2">
                <button className="publikoPune">Ruaj</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Anulo
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6 mt-10">
              <div className="flex items-center gap-2 ">
                <FolderKanban size={24} />
                <h2 className="text-2xl font-bold text-gray-900  ">
                  Projektet
                </h2>
              </div>
              <button className="publikoPune flex items-center gap-1">
                <Plus size={18} />
                Shto
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <input
                type="text"
                placeholder="Emri i projektit"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Përshkrimi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              <input
                type="text"
                placeholder="Teknologjitë (p.sh. React, Node.js, MongoDB)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Link (opsionale)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button className="publikoPune">Ruaj</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Anulo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profili;
