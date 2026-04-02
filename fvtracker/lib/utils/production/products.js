import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";
import { setProducts } from "@/store/production/products";

export const refreshProducts = async ({ dispatch, router }) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/products");
    dispatch(setProducts(res.data.products));
    console.log("Products refreshed successfully:");
    dispatch(setLoading(false));
  } catch (error) {
    console.error("Error fetching products:", error);
    dispatch(setLoading(false));
    handleError(
      {
        ...error,
        generalMessage: "Failed to fetch products. Please try again later.",
      },
      router,
    );
  }
};
