import { ChoosePlan } from "@/components/cultivation/plans/planting/choosePlan";
import { AppSelect } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";
import { ChooseWorker } from "@/components/workers/choose";
import { VARIETIES_QUALITIES } from "@/lib/constants/cultivation/plants";
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
  const workers = useSelector((state) => state.workers.items);

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
        <div>
          Branje {quantityString} {cropTypeName} {cropVarietyName || "N/A"}
        </div>
        <div>
          {!workerId && (
            <ChooseWorker workers={workers} onChoose={chooseWorker} />
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
