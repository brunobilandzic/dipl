"use client";

import { useState, Children } from "react";
import { Filter, FiltersOpenButton } from "./filter";
import { Sort, SortOpenButton } from "./sort";
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
  sortBy,
  setSortBy,
  sortOptions,
  filters,
  setFilters,
  initialFilters,
  addLabel,
  deleteLabel,
  customButtons,
  cropOptions = {},
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const clearSort = () => {
    setSortBy("newest");
    setSortOpen(false);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setFilterOpen(false);
  };

  return (
    <>
      <div className="list-header flex items-center justify-between mb-4 border-b-2 pb-1 ">
        <div className="text-xl font-bolder">{title}</div>
        <div className="flex gap-2 items-center">
          {sortBy && (
            <SortOpenButton
              isOpen={sortOpen}
              setOpen={setSortOpen}
              clearSort={clearSort}
            />
          )}
          {filters && (
            <FiltersOpenButton
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              clearFilters={clearFilters}
            />
          )}
          {onCreateItem && (
            <CreateListItemButton onCreate={onCreateItem} label={addLabel} />
          )}
          {customButtons && customButtons}
          {onDeleteList && (
            <DeleteListButton onDelete={onDeleteList} label={deleteLabel} />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-start">
        {sortBy && sortOpen && (
          <Sort
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={sortOptions}
          />
        )}
        {filters && filterOpen && (
          <Filter
            filters={filters}
            setFilters={setFilters}
            cropOptions={cropOptions}
          />
        )}

        {children}
        {Children.count(children) === 0 && (
          <p className="p-4 text-center text-gray-500">
            Nema stavki za prikaz.
          </p>
        )}
      </div>
    </>
  );
}

export function ListItem({
  children,
  actionOptions,
  title,
  _className,
  href,
  router,
}) {
  return (
    <>
      <div
        onClick={href ? () => router.push(href) : () => {}}
        className={`flex flex-col gap-2 border p-4 rounded-lg ${_className || ""} ${href ? "cursor-pointer hover:outline outline-blue-500" : ""}`}
      >
        {title && <h3 className="font-bold">{title}</h3>}
        {children}
        {actionOptions && <ActionOptions options={actionOptions} />}
      </div>
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
