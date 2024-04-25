import icon from "app/icon.svg";
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 p-2">
      <Image src={icon} alt="" width={24} height={24} className="w-6 h-6" />
      <span className="sr-only md:not-sr-only font-semibold">iWallpaper</span>
    </Link>
  );
}
