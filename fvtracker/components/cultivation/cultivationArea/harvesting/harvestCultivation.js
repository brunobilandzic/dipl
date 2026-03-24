import Modal from "@/components/layout/modals/modal";
import { ChoosePlan } from "../plans/planting/plan/choosePlan";

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
    <Modal isOpen={isOpen} onCancel={onCancel} invertColor={true}>
      <div>
        <ChoosePlan
          selectedPlan={newHarvest.plantingPlan}
          availablePlans={availablePlans}
          onChoosePlan={onChoosePlan}
          cropVarietyId={newHarvest.cropVariety?._id}
          plant={false}
          onCancel={onCancel}
        />
      </div>
    </Modal>
  );
};
