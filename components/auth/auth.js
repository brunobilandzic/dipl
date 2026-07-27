import Link from "next/link";

export const HomeButton = () => {
  return (
    <Link href="/">
      <div className="btn">Povratak na početnu stranicu</div>
    </Link>
  );
};
