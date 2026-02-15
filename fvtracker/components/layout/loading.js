import { ClipLoader } from "react-spinners";

export function Loading() {
  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <ClipLoader size={50} color="#000000" />
      </div>
    </>
  );
}
