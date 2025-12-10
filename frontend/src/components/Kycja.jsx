import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons/faEyeSlash";
import axios from "axios";

function Kycja() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const changeImage = () => {
    setShowPassword(!showPassword);
  };

  const [data, setData] = useState({
    email: "",
    fjalekalimi: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/kycja/perdoruesi",
        data,
        { withCredentials: true },
      );
      console.log("success", response.data);
      navigate("/");
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="flex justify-center items-center w-full sm:w-[300px] md:w-[400px] lg:w-[500px]
              h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]
              bg-white rounded-lg shadow-2xl p-8 sm:p-10 md:p-12"
      >
        <div>
          <h1 className="font-bold text-4xl flex justify-center items-center mb-2 sm:mb-6 md:mb-9">
            Kycu
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Email"
                className="border rounded-sm p-1 w-full sm:w-80 md:w-95 lg:w-[350px] h-10 sm:h-12 md:h-14 lg:h-10"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="fjalekalimi">Fjalekalimi</label>
              <div className="relative">
                <input
                  id="fjalekalimi"
                  type={showPassword ? "text" : "password"}
                  placeholder="Fjalekalimi"
                  className="border rounded-sm p-1 w-full sm:w-80 md:w-95 lg:w-[350px] h-10 sm:h-12 md:h-14 lg:h-10"
                  onChange={(e) =>
                    setData({ ...data, fjalekalimi: e.target.value })
                  }
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FontAwesomeIcon
                    icon={faEye}
                    className={showPassword ? "!hidden" : "!block"}
                    onClick={changeImage}
                  />
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    className={showPassword ? "!block" : "!hidden"}
                    onClick={changeImage}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="butoniKycjeRegjistrim">
              Kycu
            </button>
            <div>
              <p className="inline">Nuk keni llogari? </p>
              <Link to="/regjistrimi" className="text-blue-600 underline">
                Regjistrohuni
              </Link>
            </div>
            <Link to="/" className="text-blue-600 underline">
              Ballina
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Kycja;
