import buttons from "@/components/layout/buttons";
import cultivation from "@/lib/constants/cultivation";
const { OptionButtons } = buttons.options;
import { MdArrowLeft, MdOutlineViewColumn } from "react-icons/md";

export default function CAOptions({ onBack, onCultivate, disabled }) {
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
  ];

  return (
    <>
      <OptionButtons options={options} row={false} small={true} />
    </>
  );
}
