import { proxyToApi } from "../../../_lib/proxyApi";

type RouteContext = { params: Promise<{ userId: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { userId } = await params;
  return proxyToApi(request, `/v1/users/password/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    includeBody: true,
  });
}
