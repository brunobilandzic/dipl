import { ChoosePlan } from "@/components/cultivation/plans/planting/choosePlan";
import { AppSelect } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";
import { AppTable } from "@/components/layout/preview/table";
import { ChooseWorker } from "@/components/workers/choose";
import { VARIETIES_QUALITIES } from "@/lib/constants/cultivation/plants";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import { EMPLOYMENT_STATUS_EMPLOYED } from "@/lib/constants/users/workers";
import { useSelector } from "react-redux";

export const HarvestCultivation = ({
  isOpen,
  onCancel,
  onSubmit,
  newHarvest,
  availablePlans,
  onChoosePlan,
  workerId,
  chooseWorker,
  chooseQuality,
}) => {
  if (
    !newHarvest ||
    !newHarvest.cropVariety ||
    !newHarvest.cropVariety.cropType ||
    !newHarvest.toHarvestCells
  ) {
    return null;
  }
  const quantityToHarvest = newHarvest.toHarvestCells?.length || 0;
  const cropTypeName = newHarvest.cropVariety.cropType.name;
  const cropVarietyName = newHarvest.cropVariety.name;
  const quantityString =
    quantityToHarvest === 1 ? "1 ćelije" : `${quantityToHarvest} ćelija`;
  const workersRedux = useSelector((state) => state.workers.items);
  const workers = workersRedux.filter(
    (worker) => worker.employmentRequest.status === EMPLOYMENT_STATUS_EMPLOYED,
  );

  return (
    <FormModal
      isOpen={isOpen}
      onCancel={onCancel}
      invertColor={true}
      title="Završavanje berbe"
      onSubmit={onSubmit}
      submitDisabled={
        !newHarvest.harvestingPlan ||
        !newHarvest.quality ||
        !newHarvest.workerId
      }
      submitText="Završi berbu"
    >
      <div className="flex flex-col gap-4">
        <AppTable headerLabels={["Broj ćelija", "Količina po ćeliji", "Ukupna količina"]}
          rows={[[quantityToHarvest, newHarvest.cropVariety.quantityPerCell, quantityToHarvest * newHarvest.cropVariety.quantityPerCell]]}
        />
        <div>
          {!workerId && (
            <ChooseWorker
              workers={workers}
              onChoose={chooseWorker}
              managerModelName={CULTIVATION_MANAGER}
            />
          )}
          <AppSelect
            label="Kvaliteta"
            name="quality"
            onChange={(e) => chooseQuality(e.target.value)}
            value={newHarvest.quality}
            defaultValue={newHarvest.quality}
            options={VARIETIES_QUALITIES.map((quality) => ({
              label: quality,
              value: quality,
            }))}
          />
        </div>
        <ChoosePlan
          selectedPlan={newHarvest.harvestingPlan}
          availablePlans={availablePlans}
          onChoosePlan={onChoosePlan}
          cropVarietyId={newHarvest.cropVariety?._id}
          plant={false}
          onCancel={onCancel}
        />
      </div>
    </FormModal>
  );
};
