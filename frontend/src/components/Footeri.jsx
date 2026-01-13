function Footer() {
  return (
    <footer className="bg-[#1B262C] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Punësohu</h3>
          <p className="text-sm leading-relaxed">
            Platformë moderne për lidhjen e punëkërkuesve me kompanitë më të
            mira në Kosovë.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Për kandidatët
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Kërko punë</li>
            <li className="hover:text-white cursor-pointer">Regjistrohu</li>
            <li className="hover:text-white cursor-pointer">Ngarko CV</li>
            <li className="hover:text-white cursor-pointer">
              Apliko për punë
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Për kompanitë
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Shpall konkurs</li>
            <li className="hover:text-white cursor-pointer">
              Regjistro kompani
            </li>
            <li className="hover:text-white cursor-pointer">
              Planet e çmimeve
            </li>
            <li className="hover:text-white cursor-pointer">
              Zgjidhje rekrutimi
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Kontakt</h4>
          <p className="text-sm">Email: info-Punesohu@gmail.com</p>
          <p className="text-sm mb-4">Tel: +383 44 444 444</p>
          <div className="flex space-x-4 text-sm">
            <span className="hover:text-white cursor-pointer">Facebook</span>
            <span className="hover:text-white cursor-pointer">LinkedIn</span>
            <span className="hover:text-white cursor-pointer">Instagram</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 text-center text-sm text-gray-400">
        © 2026 Punësimi. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
}

export default Footer;
