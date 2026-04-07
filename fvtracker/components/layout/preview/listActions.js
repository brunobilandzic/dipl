import { v4 as uuid } from "uuid";

export const ListHeaderShowButton = ({ label, isOpen, setOpen, onClose }) => {
  const handleClick = () => {
    if (isOpen) {
      onClose();
    } else {
      setOpen(true);
    }
  };
  return (
    <div
      className={`btn btnSm ${isOpen ? "outline" : ""}`}
      onClick={handleClick}
    >
      {label}
    </div>
  );
};

export const ActionOptions = ({ options }) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      {options.map((option, index) => {
        return (
          <div
            className={`btn btnSm ${option.className}`}
            onClick={option.onClick}
            key={uuid()}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

export const CreateListItemButton = ({ onCreate }) => {
  return (
    <div className="btn submitButton btnSm" onClick={onCreate}>
      Dodaj
    </div>
  );
};
export const DeleteListButton = ({ onDelete }) => {
  console.log("onDelete:", onDelete);
  return (
    <div className="btn cancelButton btnSm" onClick={onDelete}>
      Obriši sve
    </div>
  );
};
