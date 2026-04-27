"use client";

import Link from "next/link";
import { List, ListItem } from "@/components/layout/preview/list";
import { FormModal, UpdateModal } from "@/components/layout/modals/form";
import { AppInput, AppTextArea } from "@/components/form/inputs";
import { showDate } from "@/lib/utils/display";
import {
  submitFacilityForm,
  deleteFacilityClient,
} from "@/lib/utils/production/facilities";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LoadingFullScreen } from "@/components/layout/loading";
import {
  refreshFacilities,
  sortFacilities,
  filterFacilities,
} from "@/store/production";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { initFilters } from "@/lib/utils/list";
import { facilitySortOptions } from "@/components/layout/preview/sort";

const emptyForm = { name: "", description: "" };

const FacilitiesList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const facilities = useSelector(
    (state) => state.production.facilities.filteredItems,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const [filters, setFilters] = useState(initFilters("facilities"));

  useEffect(() => {
    if (!facilities) return;
    dispatch(filterFacilities(filters));
  }, [filters]);

  useEffect(() => {
    if (!facilities) return;
    dispatch(sortFacilities(sortBy));
  }, [sortBy]);

  useEffect(() => {
    if (facilities === null) {
      dispatch(refreshFacilities());
    }
  }, [facilities]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    await submitFacilityForm({ form, dispatch, router });
    setForm(emptyForm);
    setCreateOpen(false);
  };

  if (!facilities) return <LoadingFullScreen />;

  return (
    <div>
      <List
        title="Postrojenja"
        onCreateItem={() => {
          setForm(emptyForm);
          setCreateOpen(true);
        }}
        addLabel="Dodaj postrojenje"
        filters={filters}
        setFilters={setFilters}
        initialFilters={initFilters("facilities")}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={facilitySortOptions}
      >
        {facilities.map((facility) => (
          <FacilityItem key={facility._id} facility={facility} />
        ))}
      </List>

      {createOpen && (
        <FormModal
          isOpen={createOpen}
          onCancel={() => setCreateOpen(false)}
          onSubmit={handleCreate}
          title="Novo postrojenje"
          submitText="Spremi"
          submitDisabled={!form.name.trim()}
        >
          <FacilityForm form={form} onChange={handleChange} />
        </FormModal>
      )}
    </div>
  );
};

export default FacilitiesList;

const FacilityItem = ({ facility }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: facility.name,
    description: facility.description ?? "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = async () => {
    await submitFacilityForm({
      form,
      facilityId: facility._id,
      dispatch,
      router,
    });
    setEditOpen(false);
  };

  const handleDelete = async () => {
    await deleteFacilityClient({ facilityId: facility._id, dispatch, router });
  };

  const actionOptions = [
    {
      label: "Uredi",
      className: "",
      onClick: () => setEditOpen(true),
    },
    {
      label: "Obriši",
      className: "cancelButton",
      onClick: handleDelete,
    },
  ];

  return (
    <>
      <ListItem actionOptions={actionOptions}>
        <Link href={`/postrojenja/${facility.slug}`} className="w-full">
          <div className="flex justify-between">
            <FacilityDetails facility={facility} />
            <FacilityStats stocks={facility.stocks} />
          </div>
        </Link>
      </ListItem>

      {editOpen && (
        <UpdateModal
          isOpen={editOpen}
          onCancel={() => setEditOpen(false)}
          onSubmit={handleEdit}
          onDelete={handleDelete}
          title="Uredi postrojenje"
        >
          <FacilityForm form={form} onChange={handleChange} />
        </UpdateModal>
      )}
    </>
  );
};

const FacilityDetails = ({ facility }) => (
  <div>
    <h2 className="text-xl font-bold">{facility.name}</h2>
    {facility.description && (
      <p className="text-sm text-gray-500">{facility.description}</p>
    )}
    <p className="text-sm text-gray-500">
      Dodano: {showDate(facility.createdAt)}
    </p>
  </div>
);

const FacilityStats = ({ stocks }) => (
  <div className="text-sm text-gray-500 text-right">
    <p>Zalihe: {stocks?.length ?? 0}</p>
  </div>
);

const FacilityForm = ({ form, onChange }) => (
  <div className="flex flex-col gap-4 p-4">
    <AppInput
      label="Naziv"
      name="name"
      value={form.name}
      onChange={onChange}
      placeholder="Naziv postrojenja"
    />
    <AppTextArea
      label="Opis"
      name="description"
      value={form.description}
      onChange={onChange}
      placeholder="Kratki opis postrojenja"
    />
  </div>
);
