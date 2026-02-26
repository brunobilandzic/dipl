import buttons from "@/components/layout/buttons";
const { OptionButtons } = buttons.options;
import { MdArrowLeft, MdOutlineViewColumn } from "react-icons/md";

export default function CAOptions({ onBack, onCultivate }) {
  const options = [
    {
      label: "Back to field",
      onClick: onBack,
      icon: <MdArrowLeft />,
    },
    {
      label: "Cultivate Cells",
      onClick: onCultivate,
      icon: <MdOutlineViewColumn /> ,
    },
  ];

  return (
    <>
      <OptionButtons options={options} row={false} small={true} />
    </>
  );
}
