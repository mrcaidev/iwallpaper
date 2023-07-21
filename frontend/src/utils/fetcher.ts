import { snakeToCamel } from "./case";

export type FetcherResponse<T> =
  | { data: T; error: null }
  | { data: null; error: Error };

export async function fetcher<T>(
  url: string,
  config?: RequestInit,
): Promise<FetcherResponse<T>> {
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
      return { data: null as T, error: null };
    }

    const { message, data } = await response.json();

    if (!response.ok) {
      return { data: null, error: new Error(message) };
    }

    return { data: snakeToCamel(data) as T, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error };
    }

    return {
      data: null,
      error: new Error("Unknown network issue. Please try again later."),
    };
  }
}
