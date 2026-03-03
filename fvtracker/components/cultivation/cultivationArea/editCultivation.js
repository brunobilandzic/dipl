import Modals from "@/components/layout/modals";

export function EditCultivation({ isOpen, onCancel, cultivationData }) {
  return (
    <Modals.UpdateModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Uredi kultivaciju"
      onSubmit={() => console.log("submit edit cultivation")}
    >
      <div>Edit cultivation form - TODO</div>
    </Modals.UpdateModal>
  );
}
