import { ChevronLeft } from "react-feather";
import { useNavigate } from "react-router-dom";

export function GoBack() {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(-1)} className="p-2">
      <ChevronLeft size={32} />
      <span className="sr-only">Go back</span>
    </button>
  );
}
