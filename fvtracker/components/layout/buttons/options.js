import { v4 as uuid } from "uuid";

export function OptionButtons({ options, row = true, small = false }) {
  return (
    <>
      <div
        className={`flex ${row ? "flex-row w-2/3 mx-auto h-fit items-stretch justify-center " : "flex-col justify-start h-full "}  gap-2`}
      >
        {options.map((option, index) => (
          <OptionButton key={uuid()} option={option} small={small} />
        ))}
      </div>
    </>
  );
}

export const OptionButton = ({ option, small }) => {
  const { label, onClick, icon } = option;
  return (
    <>
      <div
        onClick={onClick}
        className={`flex flex-col gap-2 items-center justify-center cursor-pointer min-w-12 overflow-visible  md:gap-4 btn ${small ? "w-16 h-16 btnSm" : ""}`}
      >
        <div className="text-3xl">{icon}</div>
        <div className="text-sm text-wrap text-center">{label}</div>
      </div>
    </>
  );
};
