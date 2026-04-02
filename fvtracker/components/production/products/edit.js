import { useState } from "react";

const EditProductPage = ({ product }) => {
  const [productForm, setProductForm] = useState(initialData({ product }));

  return (
    <div>
      <div>Edit product {productForm.name}</div>
    </div>
  );
};

const EditProductForm = ({ productForm, setProductForm }) => {
  const initialFormData = initialData({ product });

  return (
    <div>
      <h2>Uredi proizvod</h2>
      <pre>{JSON.stringify(initialFormData, null, 2)}</pre>
    </div>
  );
};

const initialData = ({ product }) => {
  if (!product) return testProduct;
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    ingredients: product.ingredients.map((ing) => ({
      cropVarietyName: ing.cropVariety.name,
      quantity: ing.quantity,
    })),
  };
};

