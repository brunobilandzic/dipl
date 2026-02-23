export function OptionButtons({ options }) {
  return <></>;
}

export const OptionButton = ({ action }) => {
  const { name, onClick, icon } = action;
  return (
    <>
      <div
        onClick={onClick}
        className="flex flex-col gap-2 items-center justify-center cursor-pointer"
      >
        <div className="text-3xl">{icon}</div>
        <div className="text-sm text-wrap text-center">{name}</div>
      </div>
    </>
  );
};
