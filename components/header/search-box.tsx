"use client";

import { Input } from "components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export function SearchBox() {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query")!;
    router.push(`/search?query=${query}`);
  };

  return (
    <form onSubmit={handleSubmit}>
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
        className="w-full md:w-2/3 lg:w-1/3 pl-9 bg-background appearance-none shadow-none"
      />
    </form>
  );
}
