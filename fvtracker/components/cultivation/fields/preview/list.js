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
import { deleteField, setFields } from "@/store/cultivation";
import { fieldCultivationAreaPoints } from "@/seed/cultivation/fields/create/analyze";
import { Loading } from "@/components/layout/loading";
import { useRouter } from "next/navigation";
import { FieldStatistics } from "../general";
import { refreshFields } from "@/lib/utils/cultivation/fields";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";
import { useSession } from "next-auth/react";
import { ROLE_STATUSES } from "@/lib/constants/users";

export function FieldsList({}) {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (fields) return;
    refreshFields({ dispatch, router });
  }, [fields]);

  if (!fields)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  if (fields.length === 0) {
    return <NoFields />;
  }

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

const NoFields = () => {
  const router = useRouter();
  return (
    <div className="w-full py-6 flex flex-col items-center justify-center gap-6">
      <div className="text-2xl font-bold">Nema polja za prikaz</div>

      <div className="text-sm text-gray-500">
        Početkom dodajte polje kako biste mogli pratiti svoje usjeve!{" "}
        <span
          className="ml-2 btn btnSm"
          onClick={() => router.push("/upravljanje-poljima/dodavanje")}
        >
          Dodaj polje
        </span>
      </div>
    </div>
  );
};

function FieldItem({ field }) {
  const router = useRouter();
  const dispatch = useDispatch();
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

  const handleDeleteCultivation = async () => {
    if (!confirm("Jeste li sigurni da želite obrisati ovo polje?")) {
      return;
    }
    try {
      dispatch(setLoading(true));
      await api.delete(`/cultivation/fields/`, {
        params: { slug },
      });
      dispatch(deleteField(slug));
      refreshFields({ dispatch });
    } catch (error) {
      handleError({
        ...error,
        generalMessage: "Došlo je do greške prilikom brisanja polja.",
      });
      return;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="">
        <Link href={`/upravljanje-poljima/${slug}`}>
          <ListItemHeader>
            <div className="flex justify-between w-full cursor-pointer pb-2">
              <div className="flex flex-col gap-1">
                <div className="font-bold">{field.name}</div>
              </div>
              <div
                className="cursor-pointer text-sm  px-4 cancelButton"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteCultivation();
                }}
              >
                Obriši
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
