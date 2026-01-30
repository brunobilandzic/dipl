"use client";

import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import { MdAllInclusive, MdDeleteForever, MdFoodBank } from "react-icons/md";

export default function SeedOptions() {
  const _icons = {
    seedAll: {
      icon: <MdAllInclusive />,
      label: "Seed All",
    },
    seedUsers: {
      icon: <FaUserPlus />,
      label: "Seed Users",
    },
    seedFields: {
      icon: <MdFoodBank />,
      label: "Create Field",
    }
  };

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
      <div className="flex justify-center gap-6 w-2/3 mx-auto h-14 ">
        {Object.entries(_icons).map(
          ([key, { icon, label, function: func }]) => (
            <div
              key={key}
              className="flex flex-col gap-2 btn items-center justify-center p-2  cursor-pointer"
              onClick={async () => API(label)}
            >
              <div className="text-3xl">{icon}</div>
              <div>{label}</div>
            </div>
          ),
        )}
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
      className="flex flex-col gap-2 btn items-center justify-center p-2  cursor-pointer"
    >
      <div className="text-3xl">
        <MdDeleteForever />
      </div>
      Delete DB
    </button>
  );
}
