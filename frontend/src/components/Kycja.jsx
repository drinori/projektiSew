import { Link } from "react-router-dom";
import "../index.css";
import { useState } from "react";

function Kycja() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div>
        <p className="font-bold py-10 text-2xl">Kycu</p>
        <form action="">
          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <input type="text" placeholder="Email" className="border" />
          </div>
          <div>
            <label htmlFor="fjalekalimi">Fjalekalimi</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Fjalekalimi"
                className="border"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute px-2"
              >
                {showPassword ? "Fshih" : "Shfaq"}
              </button>
            </div>
          </div>
          <Link to="/" className="block">
            Kycu
          </Link>
          <p className="inline">Nuk keni llogari?</p>
          <Link to="/regjistrohu">Regjistrohu</Link>
        </form>
      </div>
    </div>
  );
}

export default Kycja;
