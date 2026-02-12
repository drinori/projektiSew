import { useState } from 'react';
import { Mail, Phone, Calendar, MapPin, Edit2, Save, X } from 'lucide-react';


export default function ProfileKompanise() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: 'almir.berisha.st@uni-gjilan.net',
    puneHapura: '',
    rrethKompanise: '',
    kategorite: '',
    numriTelefonit: '',
    dataThemelimit: '',
    emailAdresa: '',
    vendodhja: '',
    linjetSociale: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Data saved:', formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-8 border-t-4 border-blue-500">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3">Lista e Kompanive</h1>
              <p className="text-slate-600 text-lg">Eksploroni kompanitë partner dhe mundësitë e punësimit</p>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit2 size={18} />
                  Ndrysho
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save size={18} />
                    Ruaj
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X size={18} />
                    Anulo
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Email Display */}
          <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
            <Mail className="text-blue-500" size={20} />
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span className="text-slate-700">{formData.email}</span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg p-8">
          {/* Punë të Hapura */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-slate-800">Punë të Hapura</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Aktiv
              </span>
            </div>
            {isEditing ? (
              <textarea
                name="puneHapura"
                value={formData.puneHapura}
                onChange={handleChange}
                placeholder="Shkruani informacione për punët e hapura..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed">
                {formData.puneHapura || 'Nuk ka informacione të shtuar akoma.'}
              </p>
            )}
          </div>

          <div className="border-t border-slate-200 my-8"></div>

          {/* Rreth Kompanisë */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Rreth Kompanisë</h2>
            {isEditing ? (
              <textarea
                name="rrethKompanise"
                value={formData.rrethKompanise}
                onChange={handleChange}
                placeholder="Shkruani rreth kompanisë..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed">
                {formData.rrethKompanise || 'Nuk ka informacione të shtuar akoma.'}
              </p>
            )}
          </div>

          <div className="border-t border-slate-200 my-8"></div>

          {/* Përmbledhje */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Përmbledhje</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Kategoritë */}
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Kategoritë:
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="kategorite"
                      value={formData.kategorite}
                      onChange={handleChange}
                      placeholder="p.sh. Teknologji, Shërbime"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-slate-600 pl-4">{formData.kategorite || 'Nuk është specifikuar'}</p>
                  )}
                </div>

                {/* Data e themelimit */}
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <Calendar className="text-blue-500" size={18} />
                    Data e themelimit:
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dataThemelimit"
                      value={formData.dataThemelimit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-slate-600 pl-4">{formData.dataThemelimit || 'Nuk është specifikuar'}</p>
                  )}
                </div>

                {/* Vendodhja */}
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <MapPin className="text-blue-500" size={18} />
                    Vendodhja:
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="vendodhja"
                      value={formData.vendodhja}
                      onChange={handleChange}
                      placeholder="p.sh. Prishtinë, Kosovë"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-slate-600 pl-4">{formData.vendodhja || 'Nuk është specifikuar'}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Numri i telefonit */}
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <Phone className="text-blue-500" size={18} />
                    Numri i telefonit:
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="numriTelefonit"
                      value={formData.numriTelefonit}
                      onChange={handleChange}
                      placeholder="+383 XX XXX XXX"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-slate-600 pl-4">{formData.numriTelefonit || 'Nuk është specifikuar'}</p>
                  )}
                </div>

                {/* E-mail adresa */}
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <Mail className="text-blue-500" size={18} />
                    E-mail adresa:
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="emailAdresa"
                      value={formData.emailAdresa}
                      onChange={handleChange}
                      placeholder="info@kompania.com"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-slate-600 pl-4">{formData.emailAdresa || 'Nuk është specifikuar'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 my-8"></div>

          {/* Linjet e rrjeteve sociale */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Linjet e rrjeteve sociale:</h2>
            {isEditing ? (
              <textarea
                name="linjetSociale"
                value={formData.linjetSociale}
                onChange={handleChange}
                placeholder="Shkruani linqet e rrjeteve sociale (Facebook, LinkedIn, Instagram, etj.)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed">
                {formData.linjetSociale || 'Nuk ka linqe të shtuar akoma.'}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 rounded-b-2xl shadow-lg p-6 text-center">
          <p className="text-slate-600">
            Përditësuar më: {new Date().toLocaleDateString('sq-AL')}
          </p>
        </div>
      </div>
    </div>
  );
}