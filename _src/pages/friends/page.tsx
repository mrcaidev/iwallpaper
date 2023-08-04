import { useTitle } from "hooks/use-title";

export function Page() {
  useTitle("Friends");

  return (
    <div className="px-8 py-4 mt-20">
      <h1>Friends</h1>
    </div>
  );
}
