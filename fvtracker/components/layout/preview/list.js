export function List({ children, title, onDeleteList, onCreateItem }) {
  return (
    <>
      <div className="list-header flex items-center justify-between mb-2 border-b-2 pb-1">
        <div className="text-2xl font-bolder">{title}</div>
        <div className="flex gap-2">
          {onCreateItem && (
            <div className="btn submitButton" onClick={onCreateItem}>
              Dodaj
            </div>
          )}
          {onDeleteList && (
            <div className="btn cancelButton" onClick={onDeleteList}>
              Obriši sve
            </div>
          )}
        </div>
      </div>
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
      <div className="flex flex-row gap-2  border-b-2 mb-5 pb-1 font-bolder text-lg ">
        {children}
      </div>
    </>
  );
}

export function ListItemBody({ children }) {
  return (
    <>
      <div className="flex flex-col gap-2">{children}</div>
    </>
  );
}
