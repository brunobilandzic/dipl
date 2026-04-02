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
const IngredientInput = ({ ingredient, onChange, index }) => {
  return (
    <div className="ingredient-input">
      <AppInput
        label="Naziv sorte"
        value={ingredient.cropVarietyName}
        onChange={(e) =>
          onChange({ ...ingredient, cropVarietyName: e.target.value })
        }
      />
      <AppInput
        label="Količina"
        value={ingredient.quantity}
        onChange={(e) => onChange({ ...ingredient, quantity: e.target.value })}
      />
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

const testProduct = {
  name: "Proizvod 1",
  description: "Opis proizvoda 1",
  price: 10,
  ingredients: [
    {
      cropVarietyName: "Cherry rajčica",
      quantity: 10,
    },
  ],
};
