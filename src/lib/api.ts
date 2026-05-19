/**
 * Base API fetch wrapper for making authenticated requests to the backend.
 */

interface FetchApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: BodyInit | Record<string, unknown>;
  token?: string;
}

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export async function fetchApi<TResponse>(
  path: string,
  options: FetchApiOptions = {}
): Promise<TResponse> {
  const { method = "GET", body, token } = options;

  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Check your .env file.");
  }

  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Do not set Content-Type for FormData — let fetch set the boundary automatically
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${errorBody}`
    );
  }

  const parsedJson = (await response.json()) as TResponse;
  return parsedJson;
}
