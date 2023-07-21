import { useTitle } from "hooks/use-title";

export function Page() {
  useTitle("Friends");

  return (
    <div className="mt-20 px-8 py-4">
      <h1>Friends</h1>
    </div>
  );
}
