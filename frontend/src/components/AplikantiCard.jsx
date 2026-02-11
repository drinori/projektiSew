import { useNavigate } from "react-router-dom";

function AplikantiCard({ aplikanti }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profiliAplikantit/${aplikanti._id}`);
  };

  return (
    <div className="cursor-pointer">
      <div className="border border-gray-300 rounded-lg p-4 bg-white hover:border-blue-500 transition-all duration-300">
        <p className="text-xl font-semibold text-gray-800 mb-1">
          {aplikanti.emri}
        </p>
        <p className="text-lg text-gray-600 mb-4">{aplikanti.mbiemri}</p>
        <button
          type="button"
          className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-300"
          onClick={handleClick}
        >
          Shiko me shume
        </button>
      </div>
    </div>
  );
}

export default AplikantiCard;
