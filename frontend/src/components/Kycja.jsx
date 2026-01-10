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
    } catch (err) {
      if (err.response.data.error.includes("nuk ekziston")) {
        alert("Perdoruesi nuk ekziston");
      }
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div
        className="w-full max-w-[500px]
                bg-white rounded-lg shadow-2xl 
                p-4 sm:p-6 md:p-8 lg:p-10"
      >
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-4 md:mb-6">
              Kycu
            </h1>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:gap-5"
          >
            {/* Email Field */}
            <div className="grid grid-cols-1 gap-1">
              <label htmlFor="email" className="block text-sm sm:text-base">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Email"
                className="border-[#f7f7f7] bg-[#f7f7f7] rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 pr-10"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-1">
              <label
                htmlFor="fjalekalimi"
                className="block text-sm sm:text-base"
              >
                Fjalekalimi
              </label>
              <div className="relative">
                <input
                  id="fjalekalimi"
                  type={showPassword ? "text" : "password"}
                  placeholder="Fjalekalimi"
                  className="border-[#f7f7f7] bg-[#f7f7f7] rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 pr-10"
                  onChange={(e) =>
                    setData({ ...data, fjalekalimi: e.target.value })
                  }
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                  <FontAwesomeIcon
                    icon={faEye}
                    className={
                      showPassword ? "!hidden" : "!block text-gray-800"
                    }
                    onClick={changeImage}
                    size="sm"
                  />
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    className={
                      showPassword ? "!block text-gray-600" : "!hidden"
                    }
                    onClick={changeImage}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="butoniKycjeRegjistrim w-full h-10 sm:h-12 text-sm sm:text-base"
              >
                Kycu
              </button>
            </div>

            <div className="text-center text-sm sm:text-base">
              <p className="inline">Nuk keni llogari? </p>
              <Link
                to="/regjistrimi"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Regjistrohuni
              </Link>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="text-blue-600 underline text-sm sm:text-base hover:text-blue-800"
              >
                Ballina
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Kycja;
