"use client";

import { MdAllInclusive, MdBusinessCenter } from "react-icons/md";

export default function Icons() {
  const _icons = {
    seedAll: {
      icon: <MdAllInclusive />,
      label: "Seed All",
    },
    seedManagers: {
      icon: <MdBusinessCenter />,
      label: "Seed Managers",
    },
  };

  return (
    <>
      <div className="flex justify-center gap-6 w-2/3 mx-auto h-14 ">
        {Object.entries(_icons).map(
          ([key, { icon, label, function: func }]) => (
            <div
              key={key}
              className="flex flex-col gap-2 btn items-center justify-center p-2  cursor-pointer"
              onClick={async () => {
              }}
            >
              <div className="text-3xl">{icon}</div>
              <div>{label}</div>
            </div>
          ),
        )}
      </div>
    </>
  );
}
