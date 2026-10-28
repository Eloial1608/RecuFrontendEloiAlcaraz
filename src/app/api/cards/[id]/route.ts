import { proxyToApi } from "../../_lib/proxyApi";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(request, `/v1/cards/${encodeURIComponent(id)}`);
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(request, `/v1/cards/${encodeURIComponent(id)}`, { method: "DELETE" });
}
