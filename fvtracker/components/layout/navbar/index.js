"use client";

import React, { useState } from "react";
import styles from "./navbar.module.css";
import { NavLogo, NavLinks } from "./navLinks";
import { useSelector } from "react-redux";

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
    <nav className={`${styles.container} `}>
      <NavLogo />
    </nav>
  );
};

export default Navbar;
