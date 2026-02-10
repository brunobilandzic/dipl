"use client";

import Link from "next/link";

import {
  List,
  ListItem,
  ListItemBody,
  ListItemHeader,
} from "@/components/layout/preview/list";

import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import { makeUrlFriendly } from "@/lib/utils/strings";

export function FieldsList({ fields }) {
  if (!fields || fields.length === 0) return <div>No fields found.</div>;
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
    slug
  } = field;

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
