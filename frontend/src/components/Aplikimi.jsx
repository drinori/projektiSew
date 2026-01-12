import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import {
  Upload,
  Briefcase,
  Building2,
  Mail,
  User,
  FileText,
  CheckCircle2,
} from "lucide-react";

function Aplikimi() {
  const [shpallja, setShpallja] = useState(null);
  const [aplikimi, setAplikimi] = useState({
    emailKompanise: "",
    emailAplikantit: "",
    emriAplikantit: "",
    mbiemriAplikantit: "",
    eksperienca: "",
    nrTelefonit: "",
    letraMotivuese: "",
  });
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shpallja/${id}/aplikimi`,
        );
        setShpallja(response.data.data);
      } catch (error) {
        console.log("Error:", error);
        setShpallja(null);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      alert("Ju lutem ngarkoni vetëm skedarë PDF");
    }
  };

  const shtoAplikimin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = {
        emailKompanise: shpallja.emailKompanise,
        emailAplikantit: aplikimi.emailAplikantit,
        emriAplikantit: aplikimi.emriAplikantit,
        mbiemriAplikantit: aplikimi.mbiemriAplikantit,
        nrTelefonit: aplikimi.nrTelefonit,
        eksperienca: aplikimi.eksperienca,
        letraMotivuese: aplikimi.letraMotivuese,
      };

      const response = await axios.post(
        `http://localhost:3000/api/shpallja/${id}/aplikimi`,
        dataToSend,
      );

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Diçka shkoi keq. Ju lutem provoni përsëri.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shpallja) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center p-20">
          <div className="text-center">
            <p className="text-xl text-gray-600">Duke ngarkuar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aplikimi u dërgua me sukses!
            </h2>
            <p className="text-gray-600 mb-6">
              Faleminderit për aplikimin tuaj. Do t'ju kontaktojmë së shpejti.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kthehu në faqen kryesore
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Apliko për këtë pozitë
          </h1>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm text-gray-500">Pozita:</span>
                <p className="font-semibold">{shpallja.pozitaPunes}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm text-gray-500">Kategoria:</span>
                <p className="font-semibold">{shpallja.kategoriaPunes}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-sm text-gray-500">Kompania:</span>
                <p className="font-semibold">{shpallja.emailKompanise}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Të dhënat tuaja
          </h2>

          <form onSubmit={shtoAplikimin} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="emri"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Emri <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="emri"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Shkruani emrin tuaj"
                    value={aplikimi.emriAplikantit}
                    onChange={(e) =>
                      setAplikimi({
                        ...aplikimi,
                        emriAplikantit: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="mbiemri"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mbiemri <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="mbiemri"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Shkruani mbiemrin tuaj"
                    value={aplikimi.mbiemriAplikantit}
                    onChange={(e) =>
                      setAplikimi({
                        ...aplikimi,
                        mbiemriAplikantit: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="emri@example.com"
                  value={aplikimi.emailAplikantit}
                  onChange={(e) =>
                    setAplikimi({
                      ...aplikimi,
                      emailAplikantit: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="col-span-1">
                <label
                  htmlFor="telefon"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Numri i Telefonit <span className="text-red-500">*</span>
                </label>
                <input
                  id="telefon"
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="+383 44 123 456"
                  value={aplikimi.nrTelefonit}
                  onChange={(e) =>
                    setAplikimi({ ...aplikimi, nrTelefonit: e.target.value })
                  }
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="eksperienca"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Eksperienca<span className="text-red-500">*</span>
                </label>
                <select
                  id="eksperienca"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={aplikimi.eksperienca}
                  onChange={(e) =>
                    setAplikimi({ ...aplikimi, eksperienca: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Eksperienca
                  </option>
                  <option value="0-6 muaj">0-6 muaj</option>
                  <option value="1 vjet">1 vjet</option>
                  <option value="1-2 vite">1-2 vite</option>
                  <option value="2-3 vite">2-3 vite</option>
                  <option value="3-6 vite">3-6 vite</option>
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="cv"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ngarko CV-në (PDF)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <label htmlFor="cv" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Kliko për të ngarkuar
                  </span>
                  <span className="text-gray-600"> ose tërhiq këtu</span>
                  <input
                    id="cv"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {cvFile && (
                  <p className="mt-2 text-sm text-green-600">✓ {cvFile.name}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="letraMotivuese"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Letra Motivuese
              </label>
              <textarea
                id="letraMotivuese"
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Shkruani pse jeni kandidati ideal për këtë pozitë..."
                value={aplikimi.letraMotivuese}
                onChange={(e) =>
                  setAplikimi({ ...aplikimi, letraMotivuese: e.target.value })
                }
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? "Duke dërguar..." : "Dërgo Aplikimin"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Të dhënat tuaja do të përdoren vetëm për qëllime të rekrutimit dhe do
          të trajtohen në përputhje me politikat e privatësisë.
        </p>
      </div>
    </div>
  );
}

export default Aplikimi;
