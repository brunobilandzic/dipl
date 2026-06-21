"use client";

import { List, ListItem } from "@/components/layout/preview/list";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setCrops } from "@/store/cultivation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function CropTypesList() {
  const crops = useSelector((state) => state.cultivation.crops);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (crops) return;
    api
      .get("/cultivation/plant")
      .then((res) => dispatch(setCrops(res.data)))
      .catch((error) => handleError(error));
  }, [crops, dispatch]);

  return (
    <List
      title="Kulture"
      onCreateItem={() => router.push("/kulture/dodavanje")}
    >
      {crops?.types?.map((type) => (
        <ListItem key={type._id}>
          <div className="flex justify-between">
            <div className="font-bold">{type.name}</div>
            <div className="text-gray-500">{type.generalTypeName}</div>
          </div>
          <div>
            Sorte:{" "}
            {crops.varieties
              .filter((variety) => variety.cropTypeName === type.name)
              .map((variety) => variety.name)
              .join(", ")}
          </div>
        </ListItem>
      ))}
    </List>
  );
}

export default CropTypesList;
