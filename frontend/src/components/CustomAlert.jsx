import React, { useEffect } from "react";
import { useAlert } from "../contexts/AlertContext";
import { X } from "lucide-react";

const alertStyles = {
  success: "bg-green-50 border-green-400 text-green-800",
  error: "bg-red-50 border-red-400 text-red-800",
  warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
  info: "bg-blue-50 border-blue-400 text-blue-800",
};

const CustomAlert = () => {
  const { alert, hideAlert } = useAlert();

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(hideAlert, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.open, hideAlert]);

  if (!alert.open) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-96 max-w-[90%] ease-in-out transition-all duration-300">
      <div
        className={`rounded-lg border px-4 py-3 shadow-lg ${alertStyles[alert.type]}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{alert.message}</p>
          <button
            onClick={hideAlert}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
