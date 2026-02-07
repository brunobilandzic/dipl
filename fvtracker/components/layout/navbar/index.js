"use client";

import Link from "next/link";
import roleitems from "./roleitems";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default {
  roleitems,
};

export function Navbar() {
  return (
    <div className="w-full h-16 bg-transparent flex items-center px-10 justify-center gap-4">
      <div className="w-1/6 flex justify-center items-center">
        {" "}
        <NavLogo />
      </div>
      <div className="flex gap-8 w-screen justify-center">
        <NavItems />
      </div>
      <div className="w-1/6"></div>
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
  console.log("2", session);
  const [managerModelName, setManagerModelName] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (session) {
      setManagerModelName(session.user?.managerModelName);
    }
  }, [session]);

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
  if (item.submenu) {
    return (
      <div className="relative group">
        <span className="cursor-pointer">{item.label}</span>
        <div className="absolute left-0 top-full mt-2 w-40 bg-gray-700 text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
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
