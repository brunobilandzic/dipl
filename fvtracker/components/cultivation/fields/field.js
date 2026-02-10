import { FieldGrid } from "./preview/grid";

export default function FieldPageComponent({ field }) {
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

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-4">
        <div className="text-3xl font-bold">{name}</div>
        <div className="italic">{description}</div>
        <div>
          {
            <FieldGrid
              width={width}
              length={length}
                cultivationAreas={cultivationAreas}
              
            />
          }
        </div>
      </div>
    </>
  );
}
