import { clearError } from "@/store/error";
import { useDispatch } from "react-redux";

export const ErrorComponent = ({ message }) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
      <p className="text-red-500 text-lg">{message}</p>
      <button
        className="btn"
        onClick={() => {
          dispatch(clearError());
        }}
      >
        Zatvori
      </button>
    </div>
  );
};
