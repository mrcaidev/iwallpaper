import { SearchIcon } from "lucide-react";

export default function SearchPageLoading() {
  return (
    <div className="grid place-content-center place-items-center gap-3 h-96 p-12 text-center text-balance">
      <SearchIcon size={64} className="animate-bounce" />
      <h1 className="font-bold text-3xl">Searching...</h1>
      <p className="text-muted-foreground">
        Please patiently wait for the result...
      </p>
    </div>
  );
}
