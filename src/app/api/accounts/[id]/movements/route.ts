import { proxyToApi } from "../../../_lib/proxyApi";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(request, `/v1/account/${encodeURIComponent(id)}/movements`);
}
