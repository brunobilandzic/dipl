"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import handleError from "../constants/errors/client/handleError";
import { setCrops } from "@/store/cultivation";
import api from "@/lib/api";
import { LoadingFullScreen } from "@/components/layout/loading";
import { setLoading } from "@/store/loading";
import { ErrorComponent } from "@/components/layout/error";
import { refreshHarvestingBatches } from "@/store/production";

export default function CustomProviders({ children }) {
  return (
    <HarvestingBatchesProvider>
      <CropsProvider>
        <ErrorProvider>{children}</ErrorProvider>
      </CropsProvider>
    </HarvestingBatchesProvider>
  );
}

const CropsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const crops = useSelector((state) => state.cultivation.crops);
  const user = useSelector((state) => state.user.session);
  useEffect(() => {
    if (!user) return;
    if (!crops || crops.length === 0) {
      const fetchCrops = async () => {
        try {
          dispatch(setLoading(true));
          const res = await api.get("/cultivation/plant");
          dispatch(setCrops(res.data));
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.error(error);
          handleError({
            ...error,
            generalMessage: "Greška prilikom učitavanja podataka o kulturama",
          });
        }
      };
      fetchCrops();
    }
  }, [crops, user]);

  return children;
};

const HarvestingBatchesProvider = ({ children }) => {
  const dispatch = useDispatch();
  const harvestingBatches = useSelector(
    (state) => state.production.harvestingBatches.items,
  );
  const user = useSelector((state) => state.user.session);
  useEffect(() => {
    if (!user) return;
    if (!harvestingBatches) {
      dispatch(refreshHarvestingBatches());
    }
  }, [harvestingBatches, user]);

  return children;
};

export const LoadingProvider = ({ children }) => {
  const isLoading = useSelector((state) => loadingSelector(state));

  return (
    <>
      {isLoading && <LoadingFullScreen />}
      {children}
    </>
  );
};

export const ErrorProvider = ({ children }) => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.error.message);

  if (!message) return children;
  return <ErrorComponent message={message} />;
};

const loadingSelector = (state) => {
  return (
    state.loading.isLoading ||
    state.production.loading ||
    state.warehouse.isLoading ||
    state.webstore.isLoading ||
    state.sales.isLoading ||
    state.loading.seedLoading ||
    state.procurments.isLoading
  );
};
