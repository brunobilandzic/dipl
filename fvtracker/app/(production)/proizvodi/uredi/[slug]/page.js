import EditProductPageComponent from "@/components/production/products/edit";
import { getProductBySlug } from "@/lib/production/product";
import { sanitize } from "@/lib/utils/objects";

const EditProductPage = async ({ params }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    throw new Error("Product not found");
  }

  return (
    <div>
      <EditProductPageComponent product={sanitize(product)} />
    </div>
  );
};

export default EditProductPage;
