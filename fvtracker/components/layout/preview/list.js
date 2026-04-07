import { useState } from "react";
import { Filter } from "./filter";
import { SortList, SortOpenButton } from "./sort";
import { v4 as uuid } from "uuid";
import {
  ActionOptions,
  CreateListItemButton,
  DeleteListButton,
} from "./listActions";

export function List({
  children,
  title,
  onDeleteList,
  onCreateItem,
  filterComponentProps,
  sortBy,
  setSortBy,
  filters,
  setFilters,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  return (
    <>
      <div className="list-header flex items-center justify-between mb-4 border-b-2 pb-1 ">
        <div className="text-xl font-bolder">{title}</div>
        <div className="flex gap-2 items-center">
          {sortBy && <SortOpenButton isOpen={sortOpen} setOpen={setSortOpen} />}
          {onCreateItem && <CreateListItemButton onCreate={onCreateItem} />}
          {onDeleteList && <DeleteListButton onDelete={onDeleteList} />}
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-start">
        {sortBy && <SortList sortBy={sortBy} setSortBy={setSortBy} />}
        {filters && <Filter filters={filters} setFilters={setFilters} />}
        {children}
      </div>
    </>
  );
}

export function ListItem({ children, actionOptions }) {
  return (
    <>
      <div className="flex flex-col gap-2 border p-4 rounded-lg">
        {children}
        {actionOptions && <ActionOptions options={actionOptions} />}
      </div>
    </>
  );
}

const ActionOptions = ({ options }) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      {options.map((option) => {
        return (
          <div
            className={`btn btnSm ${option.className}`}
            onClick={option.onClick}
            key={uuid()}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

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
