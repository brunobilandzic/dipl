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
  const user = useSelector((state) => state.user.session);
  useEffect(() => {
    if(!user) return;
    if (!crops) {
      const fetchCrops = async () => {
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
  }, [crops, user]);

  return children;
};
