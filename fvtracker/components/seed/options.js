"use client";

import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import { MdAllInclusive, MdDeleteForever, MdFoodBank } from "react-icons/md";
import SEED_TYPES from "@/seed/seedTypes";
import { OptionButtons } from "../layout/buttons/options";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loading";
import { signOut } from "next-auth/react";

export default function SeedOptions() {
  const dispatch = useDispatch();
  const deleteDB = async () => {
    try {
      const response = await axios.delete("/api/delete");
      const { success } = response.data;
      console.log("SUCCESS:", response.data);
      if (success) alert("Baza je uspješno obrisana");
    } catch (error) {
      console.error("Error deleting database:", error);
      throw new Error(SEED_ERROR);
    }
  };

  const options = [
    {
      label: "Sve",
      icon: <MdAllInclusive />,
      type: SEED_TYPES.ALL,
    },
    {
      label: "Korisnici",
      icon: <FaUserPlus />,
      type: SEED_TYPES.USERS,
    },
    {
      label: "Polja",
      icon: <MdFoodBank />,
      type: SEED_TYPES.FIELDS,
    },
      label: "Bilke",
      icon: <MdFoodBank />,
      type: SEED_TYPES.CROP_MAIN_TYPES,
    },
    {
      label: "Kultivacije",
      icon: <MdFoodBank />,
      type: SEED_TYPES.CULTIVATIONS,
    },
    {
      label: "Obriši bazu",
      icon: <MdDeleteForever />,
      onClick: deleteDB,
    },
  ];

  const API = async (seedType) => {
    try {
      console.log(`Seeding ${seedType}...`);
      await signOut({ redirect: false });
      dispatch(setLoading(true));
      const response = await axios.post("/api/seed", { seedType });
      console.log(response.data);
      dispatch(setLoading(false));
      alert(`${seedType} uspješno dovršeno\n${response.data.message}`);
    } catch (error) {
      console.error("Error seeding data:", error);
      throw new Error("Greška pri unosu podataka");
    }
  };

  const mapOption = (option) => {
    const { label, icon, type, onClick } = option;

    return {
      label,
      icon,
      onClick: onClick ? onClick : async () => API(type),
    };
  };

  return (
    <>
      <div className="">
        <OptionButtons options={options.map(mapOption)} center={true} />
      </div>
    </>
  );
}
