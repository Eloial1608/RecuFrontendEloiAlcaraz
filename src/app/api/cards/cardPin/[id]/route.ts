import { proxyToApi } from "../../../_lib/proxyApi";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(request, `/v1/cards/cardPin/${encodeURIComponent(id)}`, {
    method: "PUT",
    includeBody: true,
  });
}
