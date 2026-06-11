import { v4 as uuid } from "uuid";

export function OptionButtons({ options, row = true, small, center }) {
  return (
    <>
      <div
        className={`flex ${row ? "flex-row w-2/3 mx-auto h-fit items-stretch" : "flex-col ml-12"} ${center ? "justify-center" : ""} gap-2 md:gap-8 items-stretch`}
      >
        {options.map((option, index) => (
          <OptionButton
            disabled={option.disabled}
            row={row}
            key={uuid()}
            option={option}
            small={small}
          />
        ))}
      </div>
    </>
  );
}

export const OptionButton = ({ option, small, row }) => {
  const { label, onClick, icon, disabled } = option;
  if (disabled) return null;
  return (
    <>
      <div
        onClick={onClick}
        className={`flex flex-col gap-2 items-center justify-center min-w-12 overflow-visible  md:gap-4 btn w-full ${small ? "w-16 h-16 btnSm" : ""} ${row ? "" : "w-full"}`}
      >
        <div className="text-3xl">{icon}</div>
        <div className="text-sm text-wrap text-center">{label}</div>
      </div>
    </>
  );
};
