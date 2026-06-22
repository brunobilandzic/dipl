"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { List, ListItem } from "@/components/layout/preview/list";
import utils from "@/lib/utils";
import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "@/components/layout/loading";
import { redirect, useRouter } from "next/navigation";
import { FieldStatistics } from "../general";
import {
  handleDeleteField,
  refreshFields,
} from "@/lib/utils/cultivation/fields/fields";
import { initFilters } from "@/lib/utils/list";
import { v4 as uuid } from "uuid";
import { filterFields, sortFields } from "@/store/cultivation";
import { fieldSortOptions } from "@/components/layout/preview/sort";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { useSession } from "next-auth/react";
import { UNAUTHORIZED_PAGE } from "@/lib/constants/users";

export function FieldsList({}) {
  const fields = useSelector((state) => state.cultivation.filteredFields);
  const dbFields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();
  const router = useRouter();
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const initialFilters = useMemo(() => initFilters("fields"), []);
  const [filters, setFilters] = useState(initialFilters);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!fields) return;
    dispatch(filterFields(filters));
  }, [filters]);

  useEffect(() => {
    if (!fields) return;
    dispatch(sortFields(sortBy));
  }, [sortBy]);

  useEffect(() => {
    if (fields) return;
    if (status === "loading") return; // pričekaj da se sesija učita
    if (status === "unauthenticated") redirect(UNAUTHORIZED_PAGE);
    refreshFields({ dispatch, router });
  }, [fields, status]);

  if (!fields)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  if (dbFields.length === 0) {
    return <NoFields />;
  }

  return (
    <>
      <List
        title="Polja"
        onDeleteList={() => {}}
        onCreateItem={() => {
          router.push("/upravljanje-poljima/dodavanje");
        }}
        filters={filters}
        setFilters={setFilters}
        initialFilters={initialFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={fieldSortOptions}
      >
        {fields.map((field) => {
          const actionOptions = createActionOptions({
            dispatch,
            router,
            slug: field.slug,
          });
          return (
            <div key={uuid()}>
              <ListItem actionOptions={actionOptions} title={field.name}>
                <FieldItem field={field} />
              </ListItem>
            </div>
          );
        })}
      </List>
    </>
  );
}

const NoFields = () => {
  const router = useRouter();
  return (
    <div className="w-full py-6 flex flex-col items-center justify-center gap-6">
      <div className="text-2xl font-bold">Nema polja za prikaz</div>

      <div className="text-sm ">
        <span className="text-gray-500">
          {" "}
          Početkom dodajte polje kako biste mogli pratiti svoje usjeve!{" "}
        </span>
        <span
          className="ml-2 btn submitButton btnSm "
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
    createdAt,
    updatedAt,
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
          <div className="flex justify-between">
            <div>
              <div className="text-sm">
                <div>{description}</div>
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
                <FieldStatistics field={field} />
                <div>
                  Kreirano: {new Date(createdAt).toLocaleString()} - Ažurirano:{" "}
                  {new Date(updatedAt).toLocaleString()}
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
        </Link>
      </div>
    </>
  );
}

const createActionOptions = ({ slug, dispatch, router }) => [
  {
    label: "Obriši",
    className: "cancelButton",
    onClick: () => {
      handleDeleteField({ slug, dispatch, router });
    },
  },
];
