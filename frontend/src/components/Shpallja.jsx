import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAmazon } from "@fortawesome/free-brands-svg-icons";
import { faBookmark, faClock } from "@fortawesome/free-regular-svg-icons";
import Header from "./Header";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

function Shpallja() {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center">
        <div className="flex justify-center bg-[#E3E3E3] w-7xl my-2 rounded-2xl">
          <div className="flex justify-around gap-100 my-20 max-w-7xl">
            <div>
              <div className="grid grid-cols-4 grid-rows-2">
                <div className="flex row-span-2 items-center justify-start">
                  <FontAwesomeIcon
                    icon={faAmazon}
                    className="text-5xl self-center"
                  />
                </div>
                <p className="font-bold text-2xl">Vendi Punes</p>
                <p className="-col-4">
                  <FontAwesomeIcon icon={faBriefcase} />
                  Kategoria
                </p>
                <p>
                  <FontAwesomeIcon icon={faLocationDot} />
                  Lokacioni
                </p>
                <p>
                  <FontAwesomeIcon icon={faClock} />
                  Data
                </p>
              </div>
            </div>
            <FontAwesomeIcon icon={faBookmark} className="text-xl" />
          </div>
        </div>
        <p className="py-20 max-w-2xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius amet,
          cumque iure dicta exercitationem saepe! Amet sunt blanditiis ut
          similique fuga saepe velit, et molestiae delectus eos aliquid quam
          modi.
        </p>
      </div>
    </div>
  );
}

export default Shpallja;
