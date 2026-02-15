import { ClipLoader } from "react-spinners";

export function Loading() {
  return (
    <>
      <div className="w-full h-full flex items-center justify-center  text-gray-600">
        <ClipLoader size={50} color="currentColor" />
      </div>
    </>
  );
}
