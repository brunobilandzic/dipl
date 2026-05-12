import Image from "next/image";
import ThemeToggle from "../components/style/theme";
import Link from "next/link";
import { UnathorizedHomepage } from "@/components/home/unauthorized";

export default async function Home() {
  return (
    <>
      <div>
        <unauthorized />
      </div>
    </>
  );
}
