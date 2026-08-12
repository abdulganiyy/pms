import { withCheckRoute } from "@/utils/request";
import { api } from "@/utils/api";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export const POST = withCheckRoute(
  async (request: Request, { params }: RouteParams) => {
    try {
      const { id } = await params;
      const body = await request.json();

      const response = await api.post(`/restaurantorder/${id}/cancel`, body);

      return Response.json(response.data);
    } catch (error: any) {
      return Response.json(
        {
          message: error?.response?.data?.message ?? "Something went wrong",
        },
        {
          status: error?.response?.status ?? 500,
        },
      );
    }
  },
);
