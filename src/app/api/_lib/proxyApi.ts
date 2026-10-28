const API_BASE_URL = (process.env.API_BASE_URL ?? "http://localhost:5008").replace(/\/$/, "");

export function getApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export function forwardHeaders(request: Request, includeContentType = false): Headers {
  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  const contentType = request.headers.get("content-type");

  if (authorization) headers.set("authorization", authorization);
  if (cookie) headers.set("cookie", cookie);
  if (includeContentType && contentType) headers.set("content-type", contentType);

  return headers;
}

export async function proxyResponse(response: Response): Promise<Response> {
  const headers = new Headers();
  response.headers.forEach((value, key) => {
    if (["content-type", "set-cookie", "authorization", "www-authenticate"].includes(key.toLowerCase())) {
      headers.append(key, value);
    }
  });

  const body = [204, 205, 304].includes(response.status) ? null : await response.arrayBuffer();

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

interface ProxyOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  includeBody?: boolean;
  includeAuth?: boolean;
}

export async function proxyToApi(
  request: Request,
  path: string,
  { method = "GET", includeBody = false, includeAuth = true }: ProxyOptions = {},
): Promise<Response> {
  const headers = includeAuth ? forwardHeaders(request, includeBody) : new Headers();

  if (!includeAuth && includeBody) {
    headers.set("content-type", request.headers.get("content-type") ?? "application/json");
  }

  const response = await fetch(getApiUrl(path), {
    method,
    headers,
    body: includeBody ? await request.text() : undefined,
    cache: "no-store",
    credentials: "include",
  });

  return proxyResponse(response);
}
