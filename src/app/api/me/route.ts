import { proxyToApi } from "../_lib/proxyApi";

export async function GET(request: Request) {
  return proxyToApi(request, "/v1/me");
}

export async function PUT(request: Request) {
  return proxyToApi(request, "/v1/me", { method: "PUT", includeBody: true });
}
