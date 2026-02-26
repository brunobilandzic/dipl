import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import handleError from "../constants/errors/client/handleError";
import {setCrops} from "@/store/cultivation"
import api from "@/lib/api"

export default function CustomProviders({ children }) {
  return <CropsProvider>{children}</CropsProvider>;
}

const CropsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const crops = useSelector((state) => state.cultivation.crops);
  useEffect(() => {
    console.log("Crops in provider:", crops);
    if (!crops) {
      const fetchCrops = async () => {
        console.log("Fetching crops from API...");
        try {
          const res = await api.get("/cultivation/plant");
          console.log("Fetched crops from API:", res);
          dispatch(setCrops(res.data));
        } catch (error) {
          console.error(error)
          handleError({
            ...error,
            generalMessage:
              "Greška prilikom učitavanja podataka o kulturama",
          });
        }
      };
      fetchCrops();
    }
  }, [crops]);

  return children;
};
