"use client";

import { AppInput } from "@/components/form/inputs";
import { submitProductForm } from "@/lib/utils/production/products";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function EditProductPageComponent({ product }) {
  const [productForm, setProductForm] = useState(initialData({ product }));
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    console.log("Submitting form with data:", productForm);
    await submitProductForm({
      productForm,
      dispatch,
      router, // Replace with actual router instance
      isEdit: true,
    });
  };
  return (
    <div>
      <div>Edit product {productForm.name}</div>
      <div>
        <EditProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

const EditProductForm = ({ productForm, setProductForm, handleSubmit }) => {
  return (
    <div>
      <h2>Uredi proizvod</h2>
      <pre>{JSON.stringify(productForm, null, 2)}</pre>
      <div className="form">
        <AppInput
          label="Naziv proizvoda"
          value={productForm.name}
          onChange={(e) =>
            setProductForm({ ...productForm, name: e.target.value })
          }
        />
        <AppInput
          label="Opis proizvoda"
          value={productForm.description}
          onChange={(e) =>
            setProductForm({ ...productForm, description: e.target.value })
          }
        />
        <AppInput
          label="Cijena"
          value={productForm.price}
          onChange={(e) =>
            setProductForm({ ...productForm, price: e.target.value })
          }
        />
        <div className="ingredients">
          <h3>Sastojci</h3>
          {productForm.ingredients.map((ingredient, index) => (
            <IngredientInput
              key={index}
              ingredient={ingredient}
              onChange={(updatedIngredient) => {
                const updatedIngredients = [...productForm.ingredients];
                updatedIngredients[index] = updatedIngredient;
                setProductForm({
                  ...productForm,
                  ingredients: updatedIngredients,
                });
              }}
              index={index}
            />
          ))}
        </div>
        <div>
          <div onClick={handleSubmit} className="btn submitButton">
            Spremi promjene
          </div>
        </div>
      </div>
    </div>
  );
};

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
