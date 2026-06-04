import {
  getCultivationCount,
  getCultivationsArea,
} from "@/lib/utils/cultivation/fields/cultivation";
import { ReportItem } from "../dashboard";
import { getCultivationAreasArea } from "@/lib/utils/cultivation/fields/cultivationAreas";

export const CultivationCount = ({ cultivationAreas }) => {
  const cultivationsCount = getCultivationCount(cultivationAreas);
  const cultivationAreasArea = getCultivationAreasArea(cultivationAreas);
  const cultivationsArea = getCultivationsArea(
    cultivationAreas.flatMap((ca) => ca.cultivations),
  );
  return (
    <>
      <CultivationAreasCount
        count={cultivationAreas?.length}
        cultivationAreasArea={cultivationAreasArea}
      />
      <CultivationsCount
        count={cultivationsCount}
        cultivationsArea={cultivationsArea}
      />
    </>
  );
};

const CultivationAreasCount = ({ count, cultivationAreasArea }) => {
  return (
    <>
      <ReportItem description="Plodna tla" count={count}>
        <div>{cultivationAreasArea} ćelije</div>
      </ReportItem>
    </>
  );
};

const CultivationsCount = ({ count, cultivationsArea }) => {
  return (
    <>
      <ReportItem description="Gredica" count={count}>
        <div>{cultivationsArea} ćelije</div>
      </ReportItem>
    </>
  );
};
