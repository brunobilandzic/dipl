"use client";

import seedAppUsers from "@/lib/seed/users/appUsers";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import {
  MdAllInclusive,
  MdBusinessCenter,
  MdDeleteForever,
} from "react-icons/md";

export default function SeedOptions() {
  const _icons = {
    seedAll: {
      icon: <MdAllInclusive />,
      label: "Seed All",
    },
    seedAppUsers: {
      icon: <FaUserPlus />,
      label: "Seed App Users",
    },
    seedManagers: {
      icon: <MdBusinessCenter />,
      label: "Seed Managers",
    },
  };

  const API = async (seedType) => {
    try {
      const response = await axios.post("/api/seed", { seedType });
      console.log(response.data);
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
      const {success} = response.data
      console.log("SUCCESS:", response.data);
      if (success) alert("Database deleted successfully");
    } catch (error) {
      console.error("Error deleting database:", error);
      throw new Error(SEED_ERROR);
    }
  };
  return (
    <button onClick={deleteDB} className="flex flex-col gap-2 btn items-center justify-center p-2  cursor-pointer">
      <div className="text-3xl">
        <MdDeleteForever />
      </div>
      Delete DB
    </button>
  );
}
