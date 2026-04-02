"use client";

import { useState } from "react";

export default function EditProductPageComponent({ product }) {
  const [productForm, setProductForm] = useState(initialData({ product }));

  return (
    <div>
      <div>Edit product {productForm.name}</div>
      <div>
        <EditProductForm
          productForm={productForm}
          setProductForm={setProductForm}
        />
      </div>
    </div>
  );
}

const EditProductForm = ({ productForm, setProductForm }) => {
  return (
    <div>
      <h2>Uredi proizvod</h2>
      <pre>{JSON.stringify(productForm, null, 2)}</pre>
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
