"use client";

import React, { useState } from "react";
import { NavLogo } from "./navItems";
import { useSelector } from "react-redux";
import NavLinks from "./navLinks";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const appUser = useSelector((state) => state.user.appUser);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`flex items-center justify-between h-16 px-4 shadow-md;
} `}
    >
      <NavLogo />
    </nav>
  );
};

export default Navbar;
