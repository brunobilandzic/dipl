export function List({ children }) {
  return (
    <>
      <div className="flex flex-col gap-4 justify-start">{children}</div>
    </>
  );
}

export function ListItem({ children }) {
  return (
    <>
      <div className="flex flex-col gap-2">{children}</div>
    </>
  );
}

export function ListItemHeader({ children }) {
  return (
    <>
      <div className="flex flex-row gap-2  border-b-2 mb-6 pb-1 ">
        {children}
      </div>
    </>
  );
}
