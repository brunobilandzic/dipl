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

export const LoadingFullScreen = () => {
  return (
    <div className="h-screen w-full z-50 flex items-center justify-center  text-gray-600 bg-[var(--background)] opacity-70 fixed inset-0">
      <ClipLoader size={100} color="currentColor" />
    </div>
  );
};
