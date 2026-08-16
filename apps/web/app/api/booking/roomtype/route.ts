import { api } from "@/utils/api";

export const GET = async (request: Request) => {
  try {
    const response = await api.get("/booking/roomtype");

    return Response.json(response.data);
  } catch (error: any) {
    console.log(error?.response);
    return Response.json(
      { message: error?.response?.data?.message },
      { status: error?.response?.data?.statusCode },
    );
  }
};
