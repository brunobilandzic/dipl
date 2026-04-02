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

export const submitProductForm = async ({
  productForm,
  dispatch,
  router,
  isEdit = false,
}) => {
  try {
    dispatch(setLoading(true));
    let res;
    if (isEdit) {
      res = await api.put(`/products/${productForm.id}`, productForm);
    } else {
      res = await api.post("/products", productForm);
    }
    const product = res.data.product;
    console.log(
      `Product ${isEdit ? "updated" : "created"} successfully:`,
      product,
    );
    dispatch(setLoading(false));
  } catch (error) {
    console.error(`Error ${isEdit ? "updating" : "creating"} product:`, error);
    dispatch(setLoading(false));
    handleError(
      {
        ...error,
        generalMessage: `Failed to ${isEdit ? "update" : "create"} product. Please try again later.`,
      },
      router,
    );
  }
};
