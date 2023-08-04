import icon from "icon.svg";
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex justify-center lg:justify-start items-center gap-4 font-800 text-2xl"
    >
      <Image src={icon} alt="Logo." width={40} height={40} />
      <span className="sr-only lg:not-sr-only">iWallpaper</span>
    </Link>
  );
}
