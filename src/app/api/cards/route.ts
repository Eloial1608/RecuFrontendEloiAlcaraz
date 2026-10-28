import { proxyToApi } from "../_lib/proxyApi";

export async function GET(request: Request) {
  return proxyToApi(request, "/v1/cards/me");
}

export async function POST(request: Request) {
  return proxyToApi(request, "/v1/cards", {
    method: "POST",
    includeBody: true,
  });
}
