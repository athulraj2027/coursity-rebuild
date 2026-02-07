const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRequestOptions<T> = {
  path: string;
  method?: HttpMethod;
  body?: T;
};

export async function apiRequest<TResponse, TBody = undefined>({
  path,
  method = "GET",
  body,
}: ApiRequestOptions<TBody>): Promise<TResponse> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const err = await res.json();
      message = err.message ?? message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}
