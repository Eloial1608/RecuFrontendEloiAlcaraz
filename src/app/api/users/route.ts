import { proxyToApi } from "../_lib/proxyApi";

export async function GET(request: Request) {
  return proxyToApi(request, "/v1/users");
}

export async function POST(request: Request) {
  return proxyToApi(request, "/v1/users", {
    method: "POST",
    includeBody: true,
    includeAuth: false,
  });
}
