import { proxyToApi } from "../_lib/proxyApi";

export async function POST(request: Request) {
  return proxyToApi(request, "/v1/bank-operation", {
    method: "POST",
    includeBody: true,
  });
}
