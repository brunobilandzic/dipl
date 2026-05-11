import { GiFastBackwardButton } from "react-icons/gi";
import { MdArrowBack } from "react-icons/md";

export const ReturnButton = ({ onClick }) => {
  return (
    <div onClick={onClick} className="btn">
      <MdArrowBack className="text-2xl w-fit" />
    </div>
  );
};
