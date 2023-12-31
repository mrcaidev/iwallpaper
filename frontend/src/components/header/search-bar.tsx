import { useKeyDown } from "hooks/use-key-down";
import { useEffect, useId, useRef, useState } from "react";
import { Search } from "react-feather";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function SearchBar() {
  const id = useId();

  const [query, setQuery] = useState("");

  const ref = useRef<HTMLInputElement>(null);
  useKeyDown("/", () => ref.current?.focus());

  const navigate = useNavigate();
  useKeyDown("Enter", () => {
    if (query) {
      navigate("/search?query=" + encodeURIComponent(query));
    }
  });

  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("query");

  useEffect(() => {
    if (pathname !== "/search") {
      setQuery("");
      return;
    }

    if (queryParam) {
      setQuery(queryParam);
    }
  }, [pathname, queryParam]);

  return (
    <div className="relative w-full">
      <label htmlFor={id} className="absolute left-3 top-1/2 -translate-y-1/2">
        <Search size={16} className="stroke-slate-500" />
        <span className="hidden">Search bar</span>
      </label>
      <input
        ref={ref}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Type "/" to search'
        id={id}
        className="min-w-[180px] w-full max-w-sm pl-9 pr-3 py-2 rounded border border-slate-200 dark:border-slate-800 focus:outline outline-2 outline-slate-400 dark:outline-slate-600 bg-slate-100/90 dark:bg-slate-900/90 text-sm placeholder:text-slate-500"
      />
    </div>
  );
}
