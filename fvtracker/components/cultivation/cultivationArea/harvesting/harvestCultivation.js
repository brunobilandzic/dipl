import { ChoosePlan } from "../plans/planting/plan/choosePlan";
import { FormModal } from "@/components/layout/modals/form";

export const HarvestCultivation = ({
  isOpen,
  onCancel,
  onSubmit,
  newHarvest,
  setNewHarvest,
  availablePlans,
  onChoosePlan,
}) => {
  return (
    <FormModal
      isOpen={isOpen}
      onCancel={onCancel}
      invertColor={true}
      title="Završavanje berbe"
      onSubmit={onSubmit}
      submitDisabled={!newHarvest.harvestingPlan}
    >
      <div>
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
