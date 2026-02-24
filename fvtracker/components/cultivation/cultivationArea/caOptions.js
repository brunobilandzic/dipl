import buttons from "@/components/layout/buttons";
const { OptionButtons } = buttons.options;
import { MdArrowLeft } from "react-icons/md";

export default function CAOptions({ onBack }) {
  const options = [
    {
      label: "Back to field",
      onClick: onBack,
      icon: <MdArrowLeft />,
    },
  ];

  return (
    <>
      <OptionButtons options={options} row={false} small={true} />
    </>
  );
}
