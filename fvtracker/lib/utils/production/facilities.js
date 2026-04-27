import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";
import { setFacilities } from "@/store/production";

export const refreshFacilitiesClient = async ({ dispatch, router }) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/facilities");
    dispatch(setFacilities(res.data.facilities));
  } catch (error) {
    handleError(
      { ...error, generalMessage: "Greška pri dohvaćanju postrojenja." },
      router,
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const submitFacilityForm = async ({
  form,
  facilityId,
  dispatch,
  router,
}) => {
  try {
    dispatch(setLoading(true));
    if (facilityId) {
      await api.put("/facilities", form, { params: { id: facilityId } });
    } else {
      await api.post("/facilities", form);
    }
    await refreshFacilitiesClient({ dispatch, router });
  } catch (error) {
    handleError(
      {
        ...error,
        generalMessage: facilityId
          ? "Greška pri ažuriranju postrojenja."
          : "Greška pri kreiranju postrojenja.",
      },
      router,
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteFacilityClient = async ({ facilityId, dispatch, router }) => {
  if (!confirm("Jeste li sigurni da želite obrisati ovo postrojenje?")) return;
  try {
    dispatch(setLoading(true));
    await api.delete("/facilities", { params: { ids: facilityId } });
    await refreshFacilitiesClient({ dispatch, router });
  } catch (error) {
    handleError(
      { ...error, generalMessage: "Greška pri brisanju postrojenja." },
      router,
    );
  } finally {
    dispatch(setLoading(false));
  }
};
