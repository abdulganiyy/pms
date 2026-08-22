import { withCheckRoute } from "@/utils/request";
import { api } from "@/utils/api";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export const PATCH = withCheckRoute(
  async (request: Request, { params }: Params) => {
    try {
      const { id } = await params;
      const body = await request.json();

      const response = await api.patch(`/laundry/order/${id}/status`, body);

      return Response.json(response.data);
    } catch (error: any) {
      return Response.json(
        { message: error?.response?.data?.message },
        { status: error?.response?.status ?? 500 },
      );
    }
  },
);
