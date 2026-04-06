import { Filter } from "./filter";

export function List({
  children,
  title,
  onDeleteList,
  onCreateItem,
  filterComponentProps,
}) {
  return (
    <>
      <div className="list-header flex items-center justify-between mb-4 border-b-2 pb-1 ">
        <div className="text-xl font-bolder">{title}</div>
        <div className="flex gap-2 items-center">
          {onCreateItem && (
            <div className="btn submitButton btnSm" onClick={onCreateItem}>
              Dodaj
            </div>
          )}
          {onDeleteList && (
            <div className="btn cancelButton btnSm" onClick={onDeleteList}>
              Obriši sve
            </div>
          )}
        </div>
      </div>
      {filterComponentProps && <Filter {...filterComponentProps} />}
      <div className="flex flex-col gap-4 justify-start">{children}</div>
    </>
  );
}

export function ListItem({ children }) {
  return (
    <>
      <div className="flex flex-col gap-2 border p-4 rounded-lg">{children}</div>
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
