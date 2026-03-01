// this shows iup when cultvation clicked

export function CultivationMenu({ choices }) {
  return (
    <div className="form">
      {choices.map((choice) => (
        <div key={choice.value} className="btn w-full" onClick={choice.onClick}>
          {choice.label}
        </div>
      ))}
    </div>
  );
}
