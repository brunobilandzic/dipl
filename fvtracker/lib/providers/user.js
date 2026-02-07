"use client";

export default function UserProviders({ children }) {
  return <AppUserProvider>{children}</AppUserProvider>;
}

function AppUserProvider({ children }) {
/*   const appUser = useSelector((state) => state.user?.appUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const setAppUser = async () => {
      if (!appUser) await setAppUserFromApiRedux(dispatch);
    };
    setAppUser();
  }, []);
 */
  return children;
}

/* const setAppUserFromApiRedux = async (dispatch) => {
  try {
    const response = await axios.get("/api/auth/user/redux");
    console.log("Fetched app user from API response:", response.data);

    const { appUser, managerData } = response.data;
    if (!appUser) {
      dispatch(logOut());
      return;
    }
    dispatch(logIn({ appUser, managerData }));
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching app user from API");
  }
}; */