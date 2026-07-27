import { MdArrowBack } from "@react-icons/all-files/md/MdArrowBack";

export const ReturnButton = ({ onClick, returnLabel = "Povratak" }) => {
  return (
    <div title={returnLabel} onClick={onClick} className="btn text-2xl min-w-0">
      <MdArrowBack className="" />
    </div>
  );
};
