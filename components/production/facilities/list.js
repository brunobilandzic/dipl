"use client";

import Link from "next/link";
import { List, ListItem } from "@/components/layout/preview/list";
import { FormModal, UpdateModal } from "@/components/layout/modals/form";
import { AppInput, AppTextArea } from "@/components/form/inputs";
import { showDate } from "@/lib/utils/display";
import {
  submitFacilityForm,
  deleteFacilityClient,
  prepareFacilityStocksInfo,
} from "@/lib/utils/production/facilities";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LoadingFullScreen } from "@/components/layout/loading";
import {
  refreshFacilities,
  sortFacilities,
  filterFacilities,
  unselectFacility,
} from "@/store/production";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { initFilters } from "@/lib/utils/list";
import { facilitySortOptions } from "@/components/layout/preview/sort";
import { useMemo } from "react";
import { checkValue } from "@/lib/utils/formValidation";
import { checkEmpty } from "@/lib/utils/objects";
import { FaToolbox, FaVolumeHigh, FaWarehouse } from "react-icons/fa6";

const emptyForm = { name: "", description: "", volume: 0 };

const FacilitiesList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const facilities = useSelector(
    (state) => state.production.facilities.filteredItems,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const initialFilters = useMemo(() => initFilters("facilities"), []);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    dispatch(unselectFacility());
  }, []);

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
    const { name, value } = e.target;
    if (name === "volume") {
      const { value: val, error } = checkValue(value);
      if (error) {
        alert(error);
        return;
      }
      setForm((prev) => ({ ...prev, [name]: val }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
        initialFilters={initialFilters}
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
  console.log({ facility });
  const dispatch = useDispatch();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: facility.name,
    description: facility.description ?? "",
    volume: facility.volume ?? 0,
  });
  const totalProcesses = (facility.stocks || []).reduce(
    (acc, stock) => acc + (stock.productionProcesses?.length || 0),
    0,
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Handling change for", name, "with value:", value);
    if (name === "volume") {
      const { value: val, error } = checkValue(value);
      if (error) {
        alert(error);
        return;
      }
      setForm((prev) => ({ ...prev, [name]: val }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
            <FacilityStats
              stocks={facility.stocks}
              facilityVolume={facility.volume}
              totalProcesses={totalProcesses}
            />
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
          submitDisabled={checkEmpty(form, true)}
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
    <div className="listitemDescription">
      {facility.description && <p>{facility.description}</p>}
      <p>Dodano: {showDate(facility.createdAt)}</p>
      <p>Kapacitet: {facility.volume}</p>
    </div>
  </div>
);

export const FacilityStats = ({ stocks, facilityVolume, totalProcesses }) => {
  const { productCount, totalQuantity, totalVolumeUsed, manufacturedCount } =
    prepareFacilityStocksInfo({ stocks });

  return (
    <div className="text-sm flex gap-2 text-gray-500 text-right">
      <div className="flex flex-col items-center gap-1">
        <div>
          <FaWarehouse />
        </div>{" "}
        {totalVolumeUsed} od {facilityVolume}
      </div>
      <div className="flex flex-col items-center gap-1  justify-start">
        <div>
          <FaToolbox />
        </div>{" "}
        {totalProcesses}
      </div>
    </div>
  );
};

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
    <AppInput
      label="Kapacitet"
      name="volume"
      type="number"
      value={form.volume || ""}
      onChange={onChange}
      placeholder="Kapacitet postrojenja"
    />
  </div>
);
