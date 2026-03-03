import buttons from "@/components/layout/buttons";
import cultivation from "@/lib/constants/cultivation";
const { OptionButtons } = buttons.options;
import { MdAdUnits, MdArrowLeft, MdOutlineViewColumn } from "react-icons/md";

export default function CAOptions({ onBack, onCultivate, disabled }) {
  console.log(disabled)
  const options = [
    {
      label: "Back to field",
      onClick: onBack,
      icon: <MdArrowLeft />,
    },
    {
      label: cultivation.names.CULTIVATE_CELLS,
      onClick: onCultivate,
      icon: <MdOutlineViewColumn />,
      disabled: disabled?.includes(cultivation.menuModes.CULTIVATE_CELLS),
    },
    {
      label: cultivation.names.MANAGE_SEEDING,
      onClick: () => {
        console.log("manage seeding");
      }, // TODO
      icon: <MdAdUnits />,
      disabled: disabled?.includes(cultivation.menuModes.MANAGE_SEEDING),
    },
  ];

  return (
    <>
      <OptionButtons options={options} row={false} small={true} />
    </>
  );
}
