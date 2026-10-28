import { proxyToApi } from "../../_lib/proxyApi";

export async function POST(request: Request) {
  return proxyToApi(request, "/v1/login", {
    method: "POST",
    includeBody: true,
    includeAuth: false,
  });
}
