"use client";

import axios from "axios";
import { FaUserPlus } from "@react-icons/all-files/fa";
import { MdAllInclusive } from "@react-icons/all-files/md/MdAllInclusive";
import { MdDeleteForever } from "@react-icons/all-files/md/MdDeleteForever";
import { MdFactory } from "@react-icons/all-files/md/MdFactory";
import { MdFoodBank } from "@react-icons/all-files/md/MdFoodBank";
import SEED_TYPES from "@/seed/seedTypes";
import { OptionButtons } from "../layout/buttons/options";
import { useDispatch } from "react-redux";
import { setSeedLoading } from "@/store/loading";
import { signOut } from "next-auth/react";
import handleError from "@/lib/constants/errors/client/handleError";
import { logOut } from "@/store/userSlice";

export default function SeedOptions() {
  const dispatch = useDispatch();
  const deleteDB = async () => {
    console.log("Deleting database...");
    try {
      const response = await axios.delete("/api/delete");
      const { success } = response.data;
      await signOut();
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
      label: "Admin",
      icon: <FaUserPlus />,
      type: SEED_TYPES.ADMIN,
    },
    {
      label: "Radnici",
      icon: <FaUserPlus />,
      type: SEED_TYPES.SEED_WORKERS,
    },
    /* 
    {
      label: "Korisnici",
      icon: <FaUserPlus />,
      type: SEED_TYPES.USERS,
    } 
        {
      label: "Kultivacije",
      icon: <MdFoodBank />,
      type: SEED_TYPES.CULTIVATIONS,
    }, 
    {
      label: "Biljke",
      icon: <MdFoodBank />,
      type: SEED_TYPES.CROP_MAIN_TYPES,
    },*/ {
      label: "Polja",
      icon: <MdFoodBank />,
      type: SEED_TYPES.FIELDS,
    },
    {
      label: "Sadnja i berba",
      icon: <MdFoodBank />,
      type: SEED_TYPES.PLANTAGE_HARVEST,
    },
    {
      label: "Proizvodnja",
      icon: <MdFactory />,
      type: SEED_TYPES.PRODUCTION,
    },
    {
      label: "Prodaja",
      icon: <MdFactory />,
      type: SEED_TYPES.SEED_SALES,
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
      if (seedType === SEED_TYPES.ALL) {
        await signOut({ redirect: false });
        dispatch(logOut());
      }
      dispatch(setSeedLoading(true));
      const response = await axios.post("/api/seed", { seedType });
      dispatch(setSeedLoading(false));
      alert(`${seedType} uspješno dovršeno\n${response.data.message}`);
    } catch (error) {
      dispatch(setSeedLoading(false));
      console.error("Error seeding data:", error);
      handleError({
        ...error,
        generalMessage: `Greška prilikom seeding ${seedType}`,
      });
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
