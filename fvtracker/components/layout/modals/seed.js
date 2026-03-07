import Modal from "./modal"

export const SeedingModal = (isOpen, onCancel, cultivationArea, plants) => {
    return <Modal title="Seeding Modal" isOpen={isOpen} onCancel={onCancel}>
        <p>Cultivation Area: {cultivationArea}</p>
        <p>Plants: {plants.length}</p>
    </Modal>
}