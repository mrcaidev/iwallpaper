import { toast } from "react-toastify";
import { snakeToCamel } from "./case";

export async function fetcher<T>(url: string, config?: RequestInit) {
  const input = new URL(url, import.meta.env.VITE_API_BASE_URL);
  const init = {
    ...config,
    headers: {
      ...config?.headers,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(input, init);

    if (response.status === 204) {
      return null;
    }

    const { message, data } = await response.json();

    if (!response.ok) {
      toast.error(message);
      return null;
    }

    if (message) {
      toast.success(message);
    }

    return snakeToCamel(data) as T;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Unknown network issue. Please try again later.");
    }

    return null;
  }
}
