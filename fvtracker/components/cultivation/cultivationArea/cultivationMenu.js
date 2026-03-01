// this shows iup when cultvation clicked

import Modals from "@/components/layout/modals";

export function CultivationMenu({ cultivation, isOpen, choices, onCancel }) {
  return (
    <Modals.FormModal isOpen={isOpen} onCancel={onCancel}>
      <div className="form">
        {choices.map((choice) => (
          <div
            key={choice.value}
            className="btn w-full"
            onClick={choice.onClick}
          >
            {choice.label}
          </div>
        ))}
      </div>
    </Modals.FormModal>
  );
}
