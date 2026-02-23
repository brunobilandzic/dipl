"use client";

import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import { MdAllInclusive, MdDeleteForever, MdFoodBank } from "react-icons/md";
import SEED_TYPES from "@/seed/seedTypes";

export default function SeedOptions() {
  const _icons = [
    {
      label: "seedAll",
      icon: <MdAllInclusive />,
      type: SEED_TYPES.ALL,
    },
    {
      label: "seedUsers",
      icon: <FaUserPlus />,
      type: SEED_TYPES.USERS,
    },
    {
      label: "seedFields",
      icon: <MdFoodBank />,
      type: SEED_TYPES.FIELDS,
    },
    {
      label: "cropMainTypes",
      icon: <MdFoodBank />,
      type: SEED_TYPES.CROP_MAIN_TYPES,
    },
    {
      label: "cultivations",
      icon: <MdFoodBank />,
      type: SEED_TYPES.CULTIVATIONS,
    },
  ];

  const API = async (seedType) => {
    try {
      console.log(`Seeding ${seedType}...`);

      const response = await axios.post("/api/seed", { seedType });
      console.log(response.data);

      alert(`${seedType} completed successfully\n${response.data.message}`);
    } catch (error) {
      console.error("Error seeding data:", error);
      throw new Error("Error seeding data");
    }
  };

  return (
    <>
      <div className="flex justify-center items-stretch gap-6 w-2/3 mx-auto h-fit  ">
       {/*  {Object.entries(_icons).map(
          ([key, { icon, label, function: func }]) => (
            <div
              key={key}
              className="flex flex-col gap-2 btn items-center justify-around p-2 w-32  cursor-pointer "
              onClick={async () => API(label)}
            >
              <div className="text-3xl">{icon}</div>
              <div className="text-sm text-wrap text-center">{label}</div>
            </div>
          ),
        )} */}
        <DeleteDB />
      </div>
    </>
  );
}

export function DeleteDB() {
  const deleteDB = async () => {
    try {
      const response = await axios.delete("/api/delete");
      const { success } = response.data;
      console.log("SUCCESS:", response.data);
      if (success) alert("Database deleted successfully");
    } catch (error) {
      console.error("Error deleting database:", error);
      throw new Error(SEED_ERROR);
    }
  };
  return (
    <button
      onClick={deleteDB}
      className="flex flex-col gap-2 btn items-center justify-around p-2 w-32 cursor-pointer"
    >
      <div className="text-3xl">
        <MdDeleteForever />
      </div>
      Delete DB
    </button>
  );
}
