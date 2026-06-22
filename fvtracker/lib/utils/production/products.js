import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";
import { addProduct, setProducts, updateProduct } from "@/store/production";
import { checkEmpty } from "../objects";
import { stringContains } from "../strings";

export const refreshProducts = async ({ dispatch, router }) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/products");
    dispatch(setProducts(res.data.products));
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
      /*       if (!productCheckValid({ product: productForm, varieties })) {
        dispatch(setLoading(false));
        return;
      } */

      res = await api.put(`/products`, productForm, {
        params: { id: productForm.id },
      });
      dispatch(updateProduct(res.data.product));
      router.push(`/proizvodi/uredi/${res.data.product.slug}`);
    } else {
      res = await api.post("/products", productForm);
      dispatch(addProduct(res.data.product));
    }
    const product = res.data.product;

    dispatch(setLoading(false));
    alert(`Proizvod ${isEdit ? "ažuriran" : "kreiran"} uspješno!`);

    router.push("/proizvodi");
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
    if (!checkVariety({ cropVarietyId: ing.cropVarietyId, varieties })) {
      return false;
    }
  }
  return true;
};

const checkVariety = ({ cropVarietyId, varieties }) => {
  const variety = varieties.find((v) => v._id === cropVarietyId);
  if (!variety) {
    alert(`Crop variety ${cropVarietyId} not found in the list of varieties.`);
  }
  return !!variety;
};

export const deleteProducts = async ({ productIds, dispatch, router }) => {
  if (!confirm("Jeste li sigurni da želite obrisati odabrane proizvode?"))
    return;
  try {
    dispatch(setLoading(true));
    await api.delete(`/products`, { params: { ids: productIds.join(",") } });

    await refreshProducts({ dispatch, router });
  } catch (error) {
    console.error("Error deleting products:", error);
    handleError(
      {
        ...error,
        generalMessage: "Failed to delete products. Please try again later.",
      },
      router,
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export function extractVarietiesQuantities({ product, quantity }) {
  const varietiesQuantities = {};
  product.ingredients.forEach((ingredient) => {
    varietiesQuantities[ingredient.cropVariety.name] = {
      quantity: ingredient.quantity * quantity,
      quality: ingredient.quality,
    };
  });
  return varietiesQuantities;
}

export const getIngredientsList = ({ ingredients }) => {
  return ingredients
    .map((ing) => `${ing.cropVariety.name} (${ing.quality}) (${ing.quantity})`)
    .join(", ");
};

export const getUniqueIngredients = (products) =>
  new Set(
    products?.flatMap((product) =>
      product.ingredients.map((ingredient) => ingredient.cropVariety.name),
    ) || [],
  );

export const getProductionStockQuantity = (products) =>
  products?.reduce(
    (total, product) =>
      total +
      product.productionStocks.reduce(
        (stockTotal, stock) => stockTotal + stock.quantity,
        0,
      ),
    0,
  );
