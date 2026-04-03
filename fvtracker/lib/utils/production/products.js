import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";
import { setProducts } from "@/store/production/products";
import { checkEmpty } from "../objects";

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
  varieties,
}) => {
  try {
    dispatch(setLoading(true));
    let res;
    if (isEdit) {
      if (!productCheckValid({ product: productForm, varieties })) {
        dispatch(setLoading(false));
        return;
      }

      res = await api.put(`/products`, productForm, {
        params: { id: productForm.id },
      });
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
        generalMessage: `Greska pri ${isEdit ? "ažuriranju" : "kreiranju"} proizvoda. Molimo pokušajte ponovo kasnije.`,
      },
      router,
    );
  }
};

const productCheckValid = ({ product, varieties }) => {
  if (checkEmpty(product)) return false;
  for (const ing in product.ingredients) {
    if (checkEmpty(ing)) return false;
    if (!checkVariety({ cropVarietyName: ing.cropVarietyName, varieties })) {
      return false;
    }
  }
  return true;
};

const checkVariety = ({ cropVarietyName, varieties }) => {
  const variety = varieties.find((v) => v.name === cropVarietyName);
  if (!variety) {
    alert(
      `Crop variety ${cropVarietyName} not found in the list of varieties.`,
    );
  }
  return !!variety;
};
