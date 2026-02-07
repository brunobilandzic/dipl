"use client";
import { logIn, logOut, setManager } from "@/store/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function UserProviders({ children }) {
  return (
    <AppUserProvider>
      <ManagerProvider>{children}</ManagerProvider>
    </AppUserProvider>
  );
}

function AppUserProvider({ children }) {
  const appUser = useSelector((state) => state.user?.appUser);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!appUser) setAppUserFromApiRedux(dispatch);
  }, []);

  return children;
}

function ManagerProvider({ children }) {
  const manager = useSelector((state) => state.user?.manager);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!manager) fetchManagerFromApiRedux(dispatch);
  }, []);
  return children;
}

const setAppUserFromApiRedux = async (dispatch) => {
  try {
    const response = await axios.get("/api/auth/user/redux");
    console.log("Fetched app user from API response:", response.data);

    const appUser = response.data.appUser;
    if (!appUser) {
      dispatch(logOut());
      return;
    }
    dispatch(logIn({ appUser }));
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching app user from API");
  }
};

const fetchManagerFromApiRedux = async (dispatch) => {
  try {
    const response = await axios.get("/api/auth/user/redux", {
      params: { includeManager: true },
    });
    if (!response.data.managerData) {
      console.log("No manager found in API response");
      return;
    }
    dispatch(setManager(response.data.managerData));
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching manager from API");
  }
};
