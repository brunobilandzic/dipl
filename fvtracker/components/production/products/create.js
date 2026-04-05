import React from "react";
import { EditProductForm, initialData } from "./edit";
import { submitProductForm } from "@/lib/utils/production/products";

const CreateProductPageComponent = () => {
  const [productForm, setProductForm] = useState(initialData());
  const handleSubmit = async () => {
    console.log("Submitting form with data:", productForm);
    await submitProductForm({
      productForm,
      dispatch,
      router,
    });
  };
  return (
    <div>
      <div>Izradi proizvod</div>
      <div>
        <EditProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateProductPageComponent;
