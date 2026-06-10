import buttons from "@/components/layout/buttons";
import cultivation from "@/lib/constants/cultivation";
const { OptionButtons } = buttons.options;
import { MdWidgets } from "@react-icons/all-files/md/MdWidgets";
import { MdChevronLeft } from "@react-icons/all-files/md/MdChevronLeft";
import { MdRestaurant } from "@react-icons/all-files/md/MdRestaurant";
import { MdInfoOutline } from "@react-icons/all-files/md/MdInfoOutline";
import { MdDeleteForever } from "@react-icons/all-files/md/MdDeleteForever";
import { MdViewColumn } from "@react-icons/all-files/md/MdViewColumn";

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
      icon: <MdChevronLeft />,
    },
    {
      label: cultivation.names.CULTIVATE_CELLS,
      onClick: onCultivate,
      icon: <MdViewColumn />,
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
      icon: <MdWidgets />,
      disabled: disabled?.includes(cultivation.names.MANAGE_SEEDING),
    },
    {
      label: cultivation.names.HARVEST_CELLS,
      onClick: onHarvest,
      icon: <MdRestaurant />,
      disabled: disabled?.includes(cultivation.names.HARVEST_CELLS),
    },
    {
      label: cultivation.names.DELETE_CULTIVATION,
      onClick: onDelete,
      icon: <MdDeleteForever />,
      disabled: disabled?.includes(cultivation.names.DELETE_CULTIVATION),
    },
  ];

  return (
    <>
      <OptionButtons options={options} row={false} small={true} />
    </>
  );
}
