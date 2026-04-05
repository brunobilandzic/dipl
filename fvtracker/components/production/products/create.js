import React from "react";
import { initialData } from "./edit";

const CreateProductPage = () => {
  const [productForm, setProductForm] = useState(initialData());
  return <div>CreateProductPage</div>;
};

export default CreateProductPage;
