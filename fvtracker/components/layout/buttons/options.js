import { v4 as uuid } from "uuid";

export function OptionButtons({ options, row = true }) {
  return (
    <>
      <div
        className={`flex ${row ? "flex-row w-2/3 mx-auto h-fit" : "flex-col"} justify-center items-stretch gap-2 md:gap-4   `}
      >
        {options.map((option, index) => (
          <OptionButton key={uuid()} option={option} />
        ))}
      </div>
    </>
  );
}

export const OptionButton = ({ option }) => {
  const { label, onClick, icon } = option;
  return (
    <>
      <div
        onClick={onClick}
        className="flex flex-col gap-2 items-center justify-center cursor-pointer"
      >
        <div className="text-3xl">{icon}</div>
        <div className="text-sm text-wrap text-center">{label}</div>
      </div>
    </>
  );
};
