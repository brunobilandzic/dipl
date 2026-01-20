import Link from "next/link";

export const NavLogo = () => (
  // left logo to home page, on mobile hamburger to toggle navlinks
  <Link href="/">
    <div className="text-2xl font-bold">FVTracker</div>
  </Link>
);
