import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaFacebook, FaInstagram, FaGlobe } from 'react-icons/fa';
import Header from "./Header";

const ListaKompanive = () => {
  // State për të mbajtur të dhënat e kompanive
  const [kompanite, setKompanite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulojmë fetch-in e të dhënave (në praktikë do të jetë API call)
  useEffect(() => {
    const fetchKompanite = async () => {
      try {
        setLoading(true);
        // Në praktikë: const response = await axios.get('/api/kompanite');
        // setKompanite(response.data);
        
        // Të dhëna demo (do të zëvendësohen me API call real)
        const demoData = [
          {
            id: 1,
            emri: "Viva Fresh Store",
            kategoria: "Shitje / Shërbim ndaj klientit",
            email: "recruiting@vivafresh-rks.com",
            puneTeHapura: 4,
            historia: [
              {
                vitet: "1896 – 1999",
                titulli: "Tradita familjare",
                pershkrimi: "Familja Rexhepi me një traditë shumëvjeçare të punës në industrinë e tregtisë, operonte edhe me mullirin më të madh në rajon."
              },
              {
                vitet: "2003",
                titulli: "Hapja e kompanisë",
                pershkrimi: "Në qershor të vitit 2003, në zemër të Ferizajt shënohet themelimi i kompanisë dhe hapja e pikës së parë të 'Viva Fresh Store'-it në Kosovë."
              },
              {
                vitet: "2005 – 2010",
                titulli: "Zgjerimi në Kosovë",
                pershkrimi: "Suksesi në Ferizaj po përhapje në mbarë Kosovën. 'Viva Fresh' gjatë këtyre viteve zgjeroi rrjetin e dyqaneve dhe hipermarketeve në komunat kryesore të Kosovës."
              }
            ],
            permbledhje: {
              kategorite: "Shitje / Shërbim ndaj klientit",
              dataThemelimit: "2003",
              vendodhja: "Lipjan",
              telefon: "+383 (38) 408 ***",
              email: "recruiting@vivafresh-rks.com",
              socialMedia: {
                facebook: "https://www.facebook.com/vivafreshrks",
                instagram: "https://www.instagram.com/vivafreshrks"
              },
              website: "www.vivafresh-rks.com"
            }
          }
          // Mund të shtoni më shumë kompani këtu
        ];
        
        setKompanite(demoData);
        setLoading(false);
      } catch (err) {
        setError("Gabim në ngarkimin e të dhënave");
        setLoading(false);
      }
    };

    fetchKompanite();
  }, []);

  // Komponenti për një kompani të vetme
  const KompaniaCard = ({ kompania }) => {
    
    return (
        
      <div className="rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200 mt-10 ">
        {/* Header i kompanisë */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-gray">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {kompania.emri}
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full">
              {kompania.kategoria}
            </span>
            <div className="flex items-center gap-2 text-gray-600">
              <FaEnvelope className="text-blue-500" />
              <a href={`mailto:${kompania.email}`} className="hover:text-blue-600">
                {kompania.email}
              </a>
            </div>
          </div>
        </div>

        {/* Punë të hapura */}
        <div className="px-6 py-4 bg-gray-50 border-gray">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Punë të Hapura</h3>
            <span className="px-4 py-1 bg-green-100 text-green-800 font-bold rounded-full">
              {kompania.puneTeHapura}
            </span>
          </div>
        </div>

        {/* Rreth Kompanisë */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-gray">Rreth Kompanisë</h3>
          
          {/* Historia Timeline */}
          <div className="space-y-6 mb-8">
            {kompania.historia.map((periudha, index) => (
              <div key={index} className="relative pl-8">
                <div className="absolute left-0 top-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded text-sm">
                    {periudha.vitet}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {periudha.titulli}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {periudha.pershkrimi}
                </p>
              </div>
            ))}
          </div>

          {/* Përmbledhje */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Përmbledhje</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700">Kategoritë:</span>
                  <span className="text-gray-600">{kompania.permbledhje.kategorite}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-blue-500" />
                  <span className="font-medium text-gray-700">Data e themelimit:</span>
                  <span className="text-gray-600">{kompania.permbledhje.dataThemelimit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span className="font-medium text-gray-700">Vendodhja:</span>
                  <span className="text-gray-600">{kompania.permbledhje.vendodhja}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-blue-500" />
                  <span className="font-medium text-gray-700">Numri i telefonit:</span>
                  <span className="text-gray-600">{kompania.permbledhje.telefon}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-500" />
                  <span className="font-medium text-gray-700">E-mail adresa:</span>
                  <a href={`mailto:${kompania.permbledhje.email}`} className="text-blue-600 hover:underline">
                    {kompania.permbledhje.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media dhe Website */}
            <div className="mt-6 pt-6 border-t">
              <h5 className="font-medium text-gray-700 mb-3">Linjet e rrjeteve sociale:</h5>
              <div className="flex flex-wrap gap-4">
                {kompania.permbledhje.socialMedia.facebook && (
                  <a 
                    href={kompania.permbledhje.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaFacebook />
                    <span>Facebook</span>
                  </a>
                )}
                {kompania.permbledhje.socialMedia.instagram && (
                  <a 
                    href={kompania.permbledhje.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-800"
                  >
                    <FaInstagram />
                    <span>Instagram</span>
                  </a>
                )}
                {kompania.permbledhje.website && (
                  <a 
                    href={`https://${kompania.permbledhje.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  >
                    <FaGlobe />
                    <span>{kompania.permbledhje.website}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderimi kryesor
  return (
     <div className="flex flex-col items-center min-h-screen">
      <Header />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 rounded:lg">
      <div className="max-w-6xl mx-auto">
        {/* Header i listës */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 mt-10">
            Lista e Kompanive
          </h1>
          <p className="text-gray-600">
            Eksploroni kompanitë partner dhe mundësitë e punësimit
          </p>
        </div>

        {/* Kontroll për loading/error */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Duke ngarkuar kompanitë...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* Lista e kompanive */}
        {!loading && !error && (
          <div>
            {kompanite.length > 0 ? (
              <div className="space-y-6">
                {kompanite.map((kompania) => (
                  <KompaniaCard key={kompania.id} kompania={kompania} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <p className="text-gray-600">Nuk u gjet asnjë kompani</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ListaKompanive;