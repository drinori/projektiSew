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
import { useAlert } from "../contexts/AlertContext";

function Aplikimi() {
  const { showAlert } = useAlert();
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
    if (
      (file && file.type === "application/pdf") ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setCvFile(file);
    } else {
      showAlert("Ju lutem ngarkoni vetëm skedarë PDF", "info");
    }
  };

  const shtoAplikimin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    if (cvFile) {
      formData.append("cvFile", cvFile);
    } else {
      showAlert("Ju lutem ngarkoni cv-ne", "info");
      setIsSubmitting(false);
      return;
    }

    try {
      formData.append("emailKompanise", shpallja.emailKompanise);
      formData.append("emailAplikantit", aplikimi.emailAplikantit);
      formData.append("emriAplikantit", aplikimi.emriAplikantit);
      formData.append("mbiemriAplikantit", aplikimi.mbiemriAplikantit);
      formData.append("nrTelefonit", aplikimi.nrTelefonit);
      formData.append("eksperienca", aplikimi.eksperienca);
      formData.append("letraMotivuese", aplikimi.letraMotivuese);

      const response = await axios.post(
        `http://localhost:3000/api/shpallja/${id}/aplikimi`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.log("Error:", error);
      if (
        error.response.data.error.includes(
          "Ju keni aplikuar tashme per kete pozite",
        )
      ) {
        showAlert("Ju keni aplikuar tashme per kete pozite", "info");
        return;
      }
      showAlert("Diçka shkoi keq. Ju lutem provoni përsëri.", "error");
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
            <h2>Aplikimi u dërgua me sukses!</h2>
            <p className="text-gray-600 mb-6">
              Faleminderit për aplikimin tuaj. Do t'ju kontaktojmë së shpejti.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="publikoPune"
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
          <h3 className="flex justify-center text-3xl">
            Apliko për këtë pozitë
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Briefcase className="w-5 h-5 text-primary" />
              <div>
                <span className="text-sm text-gray-500">Pozita:</span>
                <p className="font-semibold">{shpallja.pozitaPunes}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <span className="text-sm text-gray-500">Kategoria:</span>
                <p className="font-semibold">{shpallja.kategoriaPunes}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <span className="text-sm text-gray-500">Kompania:</span>
                <p className="font-semibold">{shpallja.emailKompanise}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3>Të dhënat tuaja</h3>

          <form onSubmit={shtoAplikimin} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emri">
                  Emri <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="icon-aplikimi" />
                  <input
                    id="emri"
                    type="text"
                    required
                    className="input-aplikimi"
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
                <label htmlFor="mbiemri">
                  Mbiemri <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="icon-aplikimi" />
                  <input
                    id="mbiemri"
                    type="text"
                    required
                    className="input-aplikimi"
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
              <label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="icon-aplikimi" />
                <input
                  id="email"
                  type="email"
                  required
                  className="input-aplikimi"
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
                <label htmlFor="telefon">
                  Numri i Telefonit <span className="text-red-500">*</span>
                </label>
                <input
                  id="telefon"
                  type="tel"
                  required
                  className="input-aplikimi pl-2"
                  placeholder="+383 44 123 456"
                  value={aplikimi.nrTelefonit}
                  onChange={(e) =>
                    setAplikimi({ ...aplikimi, nrTelefonit: e.target.value })
                  }
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="eksperienca">
                  Eksperienca<span className="text-red-500">*</span>
                </label>
                <select
                  id="eksperienca"
                  className="input-aplikimi pl-2"
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
              <label htmlFor="cv">
                Ngarko CV-në (PDF) <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <label htmlFor="cv" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-primary font-medium">
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
              <label htmlFor="letraMotivuese">
                Letra Motivuese <span className="text-red-500">*</span>
              </label>
              <textarea
                id="letraMotivuese"
                rows="6"
                className="input-aplikimi pl-2"
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
                className="publikoPune w-full disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? "Duke dërguar..." : "Dërgo Aplikimin"}
              </button>
            </div>
          </form>
        </div>

        <p className="paragraf text-sm mt-6">
          Të dhënat tuaja do të përdoren vetëm për qëllime të rekrutimit dhe do
          të trajtohen në përputhje me politikat e privatësisë.
        </p>
      </div>
    </div>
  );
}

export default Aplikimi;
