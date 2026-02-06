"use client";

import {
  List,
  ListItem,
  ListItemBody,
  ListItemHeader,
} from "@/components/layout/preview/list";

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
  console.log("Rendering field:", field);
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
      gap: cultivationAreasGapp,
    },
  } = field;
  return (
    <>
      <div className="">
        <ListItemHeader>
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="font-bold">{field.name}</div>
            </div>
          </div>
        </ListItemHeader>
        <ListItemBody>
          <div className="text-sm">
            <div>{field.description}</div>
            <div>
              Dimensions: {width}m x {length}m
            </div>
            <div>
              Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </div>
            <div>
              CA Dim: {min_ca_dim}m - {max_ca_dim}m, Gap: {cultivationAreasGapp}
              m
            </div>
            <div>
              {cultivationAreas.length} cultivation areas, {cultivations.length}{" "}
              cultivations
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
