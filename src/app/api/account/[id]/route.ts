import { proxyToApi } from "../../_lib/proxyApi";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(request, `/v1/account/${encodeURIComponent(id)}`);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(request, `/v1/account/${encodeURIComponent(id)}`, {
    method: "PUT",
    includeBody: true,
  });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(request, `/v1/account/${encodeURIComponent(id)}`, {
    method: "PATCH",
    includeBody: true,
  });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(request, `/v1/account/${encodeURIComponent(id)}`, { method: "DELETE" });
}
