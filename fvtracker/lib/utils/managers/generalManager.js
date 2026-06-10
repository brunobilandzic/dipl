import {
  setGeneralManager,
  setManagers,
  setSpecificManagers,
} from "@/store/generalManager";
import handleError from "../../constants/errors/client/handleError";
import api from "../../api";

export const refreshGeneralManager = async ({ dispatch }) => {
  try {
    let res = await api.get("/general-manager");
    if (res.data && res.data.generalManager) {
      dispatch(setGeneralManager(res.data.generalManager));
    }
    res = await api.get("/general-manager/specific-managers");
    if (res.data && res.data.specificManagers) {
      dispatch(setSpecificManagers(res.data.specificManagers));
    }
  } catch (error) {
    handleError({
      ...error,
      generalMessage: "Greška pri dohvaćanju Generalnog Managera",
    });
  }
};

const getManagers = async (generalManager) => {
  const managers = [];
  for (const manager of generalManager.managers) {
    const res = await api.get(`/managers/${manager._id}`);
    if (res.data && res.data.manager) {
      managers.push(res.data.manager);
    }
  }
  return managers;
};
