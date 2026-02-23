import buttons from "@/components/layout/buttons";
const { OptionButtons, OptionButton } = buttons.options;
import { MdArrowLeft } from "react-icons/md";

export default function CAOptions({ onBack }) {
  const options = [
    {
      label: "Back to field",
      onClick: () => {
        console.log("back to field");
      },
      icon: <MdArrowLeft />,
    },
  ];

  return (
    <div className="p-4">
      <OptionButtons options={options} />
    </div>
  );
}
