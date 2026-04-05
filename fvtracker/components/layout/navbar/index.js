"use client";

import Link from "next/link";
import roleitems from "./roleitems";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/userSlice";
import { refreshFields } from "@/lib/utils/cultivation/fields";
import { refreshGeneralManager } from "@/lib/utils/generalManager";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { useRouter } from "next/navigation";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";

export default {
  roleitems,
};

export function Navbar() {
  return (
    <div className=" relative h-16 bg-transparent flex items-center px-10 ">
      <div className="flex-1 flex justify-start items-center">
        {" "}
        <NavLogo />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex gap-8">
        <NavItems />
      </div>
      <div className=" flex-1 flex justify-end gap-8 ">
        <Link href="/seed">test podaci</Link>
        <Link href="/autorizacija">aautorizacija</Link>
      </div>
    </div>
  );
}

function NavLogo() {
  return (
    <h1 className="text-lg font-bold">
      <Link href="/">FvTracker</Link>
    </h1>
  );
}

function NavItems() {
  const { data: session, status } = useSession();
  const [managerModelName, setManagerModelName] = useState(null);
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const generalManagerRedux = useSelector(
    (state) => state.generalManager?.manager,
  );
  const fieldsRedux = useSelector((state) => state.cultivation.fields);

  useEffect(() => {
    if (status === "authenticated" && session.user?.managerModelName) {
      const managerModelName = session.user.managerModelName;
      setManagerModelName(session.user?.managerModelName);
      dispatch(login(session.user));
      if (
        managerModelName === CULTIVATION_MANAGER &&
        !fieldsRedux &&
        session.user?.roleStatus === ROLE_STATUSES.APPROVED
      ) {
        refreshFields({ dispatch, router });
      }
      if (managerModelName === "GeneralManager" && !generalManagerRedux) {
        refreshGeneralManager({ dispatch });
      }
    }
  }, [status]);

  useEffect(() => {
    if (managerModelName) {
      setItems(roleitems[managerModelName] || []);
    }
  }, [managerModelName]);

  return (
    <>
      {items.map((item, index) => (
        <NavItem key={index} item={item} />
      ))}
    </>
  );
}

function NavItem({ item }) {
  const [subMenuOpen, setSubmenuOpen] = useState(false);
  if (item.submenu) {
    return (
      <div
        onMouseEnter={() => setSubmenuOpen(true)}
        onMouseLeave={() => setSubmenuOpen(false)}
        className="relative group "
      >
        <span className="cursor-pointer">{item.label}</span>
        <div
          className={`absolute top-full left-0  w-48 bg-gray-800 text-white rounded shadow-lg ${subMenuOpen ? "block" : "hidden"}`}
        >
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.path}
              className="block px-4 py-2 hover:bg-gray-600"
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <Link href={item.path} className="hover:underline">
        {item.label}
      </Link>
    );
  }
}

function getManager(dispatch) {}
