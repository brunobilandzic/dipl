"use client";

import { useSelector } from "react-redux";
import { ReportSector } from "../dashboard";
import { FieldStats } from "./field";
import { CropsReportSection } from "./crops";
import { LoadingFullScreen } from "@/components/layout/loading";

export const CultivationReport = ({}) => {
  const fields = useSelector((state) => state.cultivation.fields);
  if (!fields) return <LoadingFullScreen />;
  return (
    <ReportSector title="Kultivacija">
      <FieldStats fields={fields} />
      <CropsReportSection fields={fields} />
    </ReportSector>
  );
};
