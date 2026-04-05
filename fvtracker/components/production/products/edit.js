"use client";

import { ChooseCropVarietyItems } from "@/components/cultivation/crops/choose";
import { AppInput } from "@/components/form/inputs";
import { LoadingFullScreen } from "@/components/layout/loading";
import { submitProductForm } from "@/lib/utils/production/products";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditProductPageComponent({ product }) {
  const [productForm, setProductForm] = useState(initialData({ product }));
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    console.log("Submitting form with data:", productForm);
    await submitProductForm({
      productForm,
      dispatch,
      router,
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
  const addIngredient = () => {
    setProductForm({
      ...productForm,
      ingredients: [...productForm.ingredients, emptyIngredient],
    });
  };

  const onChangeIngredient = ({ index, updatedIngredient }) => {
    const updatedIngredients = [...productForm.ingredients];
    updatedIngredients[index] = updatedIngredient;
    setProductForm({ ...productForm, ingredients: updatedIngredients });
  };

  const onDeleteIngredient = (index) => {
    const updatedIngredients = productForm.ingredients.filter(
      (ing, i) => i !== index,
    );
    setProductForm({ ...productForm, ingredients: updatedIngredients });
  };

  const crops = useSelector((state) => state.cultivation.crops);

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
          type="number"
          onChange={(e) =>
            setProductForm({ ...productForm, price: e.target.value })
          }
        />
        <ChooseCropVarietyItems
          crops={crops}
          cropsData={productForm}
          setCropsData={setProductForm}
          itemsName="ingredients"
          itemLabel="sastojak"
          emptyItem={emptyIngredient}
        />

        {/* <div className="ingredients">
          <div className="flex items-center justify-between mb-2">
            <h3>Sastojci</h3>
            <div className="btn" type="button" onClick={addIngredient}>
              Dodaj sastojak
            </div>
          </div>
          {productForm.ingredients.map((ingredient, index) => (
            <IngredientInput
              key={index}
              ingredient={ingredient}
              onChange={onChangeIngredient}
              index={index}
              onDelete={onDeleteIngredient}
            />
          ))}
        </div> */}
        <div>
          <div onClick={handleSubmit} className="btn submitButton">
            Spremi promjene
          </div>
        </div>
      </div>
    </div>
  );
};

/* const IngredientInput = ({ ingredient, onChange, index, onDelete }) => {
  const crops = useSelector((state) => state.cultivation.crops);

  return (
    <div className="border p-2 mb-2 rounded flex flex-col gap-2">
      <div className="flex items-center justify-between mt-1">
        <div className="text-lg font-semibold">Sastojak {index + 1}</div>
        <div
          className="btn cancelButton bg-transparent outline outline-red-500"
          type="button"
          onClick={() => onDelete(index)}
        >
          Obriši sastojak
        </div>
      </div>
      <ChooseCropVarietyItems crops={crops}>
        <AppInput
          label="Količina"
          type="number"
          value={ingredient.quantity}
          onChange={(e) =>
            onChange({
              index,
              updatedIngredient: {
                ...ingredient,
                quantity: e.target.value,
              },
            })
          }
        />
      </ChooseCropVarietyItems>
    </div>
  );
}; */

const initialData = ({ product }) => {
  if (!product) return testProduct;
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    ingredients: product.ingredients.map((ing) => ({
      id: ing._id,
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

const emptyIngredient = {
  generalType: "",
  type: "",
  cropVariety: "",
  quantity: "",
};
