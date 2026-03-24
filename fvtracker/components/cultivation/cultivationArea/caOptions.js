import buttons from "@/components/layout/buttons";
import cultivation from "@/lib/constants/cultivation";
const { OptionButtons } = buttons.options;
import {
  MdAdUnits,
  MdArrowLeft,
  MdDeleteOutline,
  MdFoodBank,
  MdInfoOutline,
  MdOutlineDeleteForever,
  MdOutlineViewColumn,
} from "react-icons/md";

export default function CAOptions({
  onBack,
  onCultivate,
  disabled,
  onEdit,
  onDelete,
  onPlant,
  onHarvest,
}) {
  const options = [
    {
      label: "Natrag",
      onClick: onBack,
      icon: <MdArrowLeft />,
    },
    {
      label: cultivation.names.CULTIVATE_CELLS,
      onClick: onCultivate,
      icon: <MdOutlineViewColumn />,
      disabled: disabled?.includes(cultivation.names.CULTIVATE_CELLS),
    },
    {
      label: cultivation.names.EDIT_INFO,
      onClick: onEdit, // TODO
      icon: <MdInfoOutline />,
      disabled: disabled?.includes(cultivation.names.EDIT_INFO),
    },
    {
      label: cultivation.names.MANAGE_SEEDING,
      onClick: onPlant,
      icon: <MdAdUnits />,
      disabled: disabled?.includes(cultivation.names.MANAGE_SEEDING),
    },
    {
      label: cultivation.names.HARVEST_CELLS,
      onClick: onHarvest,
      icon: <MdFoodBank />,
      disabled: disabled?.includes(cultivation.names.HARVEST_CELLS),
    },
    {
      label: cultivation.names.DELETE_CULTIVATION,
      onClick: onDelete,
      icon: <MdOutlineDeleteForever />,
      disabled: disabled?.includes(cultivation.names.DELETE_CULTIVATION),
    },
  ];

  return (
    <>
      <OptionButtons options={options} row={false} small={true} />
    </>
  );
}
