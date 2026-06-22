"use client";

import { Loading } from "@/components/layout/loading";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import utils from "@/lib/utils";
import { setFields } from "@/store/cultivation";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { FieldPlansItem } from "@/components/cultivation/plans/planting/list";
import { refreshFields } from "@/lib/utils/cultivation/fields/fields";
import { List } from "@/components/layout/preview/list";
import { useRouter } from "next/navigation";
import { deletePlans } from "@/lib/utils/cultivation/plant/plans";

const HarvestingPlanList = () => {
  const fields = useSelector((state) => state.cultivation.fields);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (fields) return;

    refreshFields({ dispatch });
  }, [fields]);

  if (!fields)
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <Loading />
      </div>
    );
  const fieldsPlans = utils.plans.getFieldsHarvestingPlans(fields);
  if (fieldsPlans.length === 0)
    return <div className="text-center mt-4">Nema planova berbe za prikaz</div>;
  return (
    <>
      <div>
        <List
          title="Planovi berbe"
          onCreateItem={() => router.push("/plan-berbe/izradi")}
          onDeleteList={deletePlans}
        >
          {fieldsPlans.map((fieldPlan, index) => (
            <div key={uuid()}>
              <FieldPlansItem fieldPlans={fieldPlan} plant={false} />
            </div>
          ))}
        </List>
      </div>
    </>
  );
};

export default HarvestingPlanList;
