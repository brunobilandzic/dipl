import { OptionButtons } from "@/components/layout/buttons/options";
import { MdArrowLeft } from "react-icons/md";

export default function CAOptions({ onBack }) {
  const options = [
    {
      name: "Back to field",
      onClick: () => {
        console.log("back to field");
      },
      icon: <MdArrowLeft />,
    },
  ];

  return (
    <div className="p-4">
      <OptionButtons actions={actions} />
    </div>
  );
}
