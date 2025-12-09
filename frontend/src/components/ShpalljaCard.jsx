import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAmazon } from "@fortawesome/free-brands-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import "../index.css";
import { useNavigate } from "react-router-dom";

function ShpalljaCard({ shpallja }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/shpallja/${shpallja._id}`);
  };

  return (
    <div
      className="flex justify-center gap-7 border border-gray-200 hover:bg-gray-200 shadow-xl px-5 py-5 my-10 w-fit h-fit cursor-pointer mx-5"
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faAmazon} className="text-5xl" />
      <div className="px-5">
        <p className="font-bold text-xl">{shpallja.pozitaPunes}</p>
        <p>
          <FontAwesomeIcon icon={faBriefcase} />
          {shpallja.kategoriaPunes}
        </p>
        <p>
          <FontAwesomeIcon icon={faLocationDot} />
          {shpallja.lokacioniPunes}
        </p>
      </div>
      <FontAwesomeIcon icon={faBookmark} />
    </div>
  );
}

export default ShpalljaCard;
