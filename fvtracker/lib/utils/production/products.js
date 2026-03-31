import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";

export const refreshProducts = async ({ dispatch, router }) => {
  try {
    const res = await api.get("/products");
    dispatch(setProducts(res.data.products));
    console.log("Products refreshed successfully:");
  } catch (error) {
    console.error("Error fetching products:", error);
    handleError(
      {
        ...error,
        generalMessage: "Failed to fetch products. Please try again later.",
      },
      router,
    );
  }
};
