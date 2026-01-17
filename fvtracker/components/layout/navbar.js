"use client";

import React, { useState } from "react";
import styles from "./navbar.module.css";
import { NavLogo, NavLinks } from "./navitems";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
