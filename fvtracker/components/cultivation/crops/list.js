"use client";

import { List, ListItem } from "@/components/layout/preview/list";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setCrops } from "@/store/cultivation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterItems, initFilters, sortItems } from "@/lib/utils/list";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { cropTypeSortOptions } from "@/components/layout/preview/sort";
import { getCropOptions } from "@/lib/utils/cultivation/plant/crops";

function CropTypesList() {
  const crops = useSelector((state) => state.cultivation.crops);
  const dispatch = useDispatch();
  const router = useRouter();
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const initialFilters = useMemo(() => initFilters("cropTypes"), []);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    if (crops) return;
    api
      .get("/cultivation/plant")
      .then((res) => dispatch(setCrops(res.data)))
      .catch((error) => handleError(error));
  }, [crops, dispatch]);

  console.log("crops", crops);

  console.log("filters", filters);

  const displayedTypes = useMemo(() => {
    const filtered = filterItems({
      _items: crops?.types || [],
      itemModelName: "CropType",
      filters,
    });
    return sortItems({ items: filtered, sortBy });
  }, [crops, filters, sortBy]);

  return (
    <List
      title="Kulture"
      onCreateItem={() => router.push("/kulture/dodavanje")}
      sortBy={sortBy}
      setSortBy={setSortBy}
      sortOptions={cropTypeSortOptions}
      filters={filters}
      setFilters={setFilters}
      initialFilters={initialFilters}
      cropOptions={getCropOptions({ crops, existingFilters: filters })}
    >
      {displayedTypes.map((type) => (
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
