import { ChoosePlan } from "../plans/planting/plan/choosePlan";
import { FormModal } from "@/components/layout/modals/form";

export const HarvestCultivation = ({
  isOpen,
  onCancel,
  onSubmit,
  newHarvest,
  availablePlans,
  onChoosePlan,
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
  return (
    <FormModal
      isOpen={isOpen}
      onCancel={onCancel}
      invertColor={true}
      title="Završavanje berbe"
      onSubmit={onSubmit}
      submitDisabled={!newHarvest.harvestingPlan}
      submitText="Završi berbu"
    >
      <div className="flex flex-col gap-4">
        <div>
          Branje {quantityString} {cropTypeName} {cropVarietyName || "N/A"}
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
