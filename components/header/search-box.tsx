"use client";

import { Input } from "components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEventHandler } from "react";

export function SearchBox() {
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query")!.toString();
    router.push(`/search?query=${query}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <SearchIcon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        name="query"
        placeholder="Search wallpapers..."
        required
        maxLength={50}
        className="w-full lg:w-1/2 xl:w-1/3 pl-9 bg-background"
      />
    </form>
  );
}
