"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  List,
  ListItem,
  ListItemBody,
  ListItemHeader,
} from "@/components/layout/preview/list";

import utils from "@/lib/utils";

import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setFields } from "@/store/cultivation";

export function FieldsList({}) {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fields && fields.length > 0) return;

    (async () => {
      try {
        const res = await axios.get("/api/cultivation/fields");
        if (res.data && res.data.fields) {
          dispatch(setFields(res.data.fields));
        }
      } catch (error) {
        console.log("Error fetching fields:", error);
        const errorMessage =
          error.response?.data?.message || error.message || "Unknown error";
        alert(`Error fetching fields: ${errorMessage}`);
      }
    })();
  }, [fields]);

  return (
    <>
      <List>
        {fields.map((field) => (
          <ListItem key={field._id}>
            <FieldItem field={field} />
          </ListItem>
        ))}
      </List>
    </>
  );
}

function FieldItem({ field }) {
  if (!field) return null;
  const {
    name,
    description,
    dimensions: { width, length },
    location: { latitude, longitude },
    cultivationAreas,
    cultivations,
    cultivationAreaDimensions: {
      min_ca_dim,
      max_ca_dim,
      gap: cultivationAreasGap,
    },
    slug,
  } = field;

  const [plantedCells, setPlantedCells] = useState(
    cultivationAreas
      ? utils.cultivation.cultivationAreas.getCASCells(cultivationAreas)
      : [],
  );

  return (
    <>
      <div className="">
        <Link href={`/upravljanje-poljima/${slug}`}>
          <ListItemHeader>
            <div className="flex justify-between w-full cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-500">
              <div className="flex flex-col gap-1">
                <div className="font-bold">{field.name}</div>
              </div>
            </div>
          </ListItemHeader>
        </Link>
        <ListItemBody>
          <div className="flex justify-between">
            <div>
              <div className="text-sm">
                <div>{field.description}</div>
                <div>
                  Dimensions: {width}m x {length}m
                </div>
                <div>
                  Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </div>
                <div>
                  CA Dim: {min_ca_dim}m - {max_ca_dim}m, Gap:{" "}
                  {cultivationAreasGap}m
                </div>
                <div>
                  {cultivationAreas.length} cultivation areas,{" "}
                  {cultivations.length} cultivations
                </div>
              </div>
            </div>
            <div className="">
              {/* Placeholder for field grid or map */}
              <FieldGrid
                width={width}
                length={length}
                cultivationAreas={cultivationAreas}
                small={true}
                plantedCells={plantedCells}
              />
            </div>
          </div>
        </ListItemBody>
      </div>
    </>
  );
}

function FieldContainer({ children }) {
  return <></>;
}
