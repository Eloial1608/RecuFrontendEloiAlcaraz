import { proxyToApi } from "../_lib/proxyApi";

export async function GET(request: Request) {
  try {
    return await proxyToApi(request, "/v1/accounts/me");
  } catch {
    return Response.json({ message: "Unable to retrieve accounts." }, { status: 500 });
  }
}
