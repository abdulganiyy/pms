import { api } from "@/utils/api";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const response = await api.post("/booking", body);

    const data = response.data;

    return Response.json(data);
  } catch (error: any) {
    console.log(error?.response);
    return Response.json(
      { message: error?.response?.data?.message },
      { status: error?.response?.data?.statusCode },
    );
  }
};

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const response = await api.get("/booking/availability", {
      params: Object.fromEntries(searchParams.entries()),
    });

    return Response.json(response.data);
  } catch (error: any) {
    console.log(error?.response);
    return Response.json(
      { message: error?.response?.data?.message },
      { status: error?.response?.data?.statusCode },
    );
  }
};
