export async function callInternalApi(
  url: string,
  method: "POST" | "PATCH" | "GET",
  data: any,
  userContext: {
    userId: string;
    role: string;
  },
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-internal-key": process.env.INTERNAL_SECRET!,
    "x-user-id": userContext.userId,
    "x-user-role": userContext.role,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  // Only attach body if not GET
  if (method !== "GET") {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${process.env.BACKEND_URL}${url}`, options);
  console.log("RESPONSE : ", response);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Internal API failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}
