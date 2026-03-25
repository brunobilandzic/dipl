"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
import { fieldCultivationAreaPoints } from "@/seed/cultivation/fields/create/analyze";
import { Loading } from "@/components/layout/loading";
import { useRouter } from "next/navigation";
import { FieldStatistics } from "../general";

export function FieldsList({}) {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fields && fields.length > 0) return;

    (async () => {
      try {
        const res = await axios.get("/api/cultivation/fields");
        if (
          res.data &&
          res.data.fields &&
          Array.isArray(res.data.fields) &&
          res.data.fields.length > 0
        ) {
          dispatch(setFields(res.data.fields));
        }
      } catch (error) {
        console.log("Error fetching fields:", error);
        const errorMessage =
          error.response?.data?.message || error.message || "Nepoznata greška";
        alert(`Greška pri dohvaćanju polja: ${errorMessage}`);
      }
    })();
  }, [fields]);

  if (!fields || fields.length === 0)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

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
  const router = useRouter();
  if (!field) return null;
  const {
    name,
    description,
    dimensions: { width, length },
    location: { latitude, longitude },
    cultivationAreas,
    cultivationAreaDimensions: {
      min_ca_dim,
      max_ca_dim,
      gap: cultivationAreasGap,
    },
    slug,
  } = field;

  const cultivationCells = useMemo(() => {
    if (!cultivationAreas) return [];
    const cultivations =
      utils.cultivation.cultivations.getCASCultivations(cultivationAreas);
    const plcvs = utils.cultivation.cultivations.getPlCvs(cultivations);
    return plcvs;
  }, [field]);

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
              <FieldStatistics field={field} />
              <div className="text-sm">
                <div>{field.description}</div>
                <div>
                  Dimenzije: {width}m x {length}m
                </div>
                <div>
                  Lokacija: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </div>
                <div>
                  Dimenzije PK: {min_ca_dim}m - {max_ca_dim}m, Razmak:{" "}
                  {cultivationAreasGap}m
                </div>
                <div>
                  {cultivationAreas.length} područja kultivacije,{" "}
                  {
                    cultivationAreas.reduce(
                      (cus, ca) => cus.concat(ca.cultivations),
                      [],
                    ).length
                  }{" "}
                  kultivacija
                </div>
              </div>
            </div>
            {/* Placeholder for field grid or map */}
            <div
              className="cursor-pointer"
              onClickCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/upravljanje-poljima/${slug}`);
              }}
            >
              <FieldGrid
                width={width}
                length={length}
                cultivationAreas={cultivationAreas}
                small={true}
                plantedCells={plantedCells}
                cultivationCells={cultivationCells}
                cuCellsFieldCoords={true}
              />
            </div>
          </div>
        </ListItemBody>
      </div>
    </>
  );
}
