import { withCheckRoute } from "@/utils/request";
import { api } from "@/utils/api";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export const GET = withCheckRoute(
  async (request: Request, { params }: Params) => {
    try {
      const { id } = await params;

      const response = await api.get(`/laundry/item/${id}`);

      return Response.json(response.data);
    } catch (error: any) {
      return Response.json(
        { message: error?.response?.data?.message },
        { status: error?.response?.status ?? 500 },
      );
    }
  },
);

export const PATCH = withCheckRoute(
  async (request: Request, { params }: Params) => {
    try {
      const { id } = await params;
      const body = await request.json();

      const response = await api.patch(`/laundry/item/${id}`, body);

      return Response.json(response.data);
    } catch (error: any) {
      return Response.json(
        { message: error?.response?.data?.message },
        { status: error?.response?.status ?? 500 },
      );
    }
  },
);
