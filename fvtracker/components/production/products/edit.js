"use client";

import {
  ChooseCropVarietyItems,
  testCropItemData,
} from "@/components/cultivation/crops/choose";
import { QuantityInput } from "@/components/cultivation/plans/planting/create";
import SubmitButton from "@/components/form";
import { AppInput, AppSelect } from "@/components/form/inputs";
import {
  STANDARD,
  VARIETIES_QUALITIES,
} from "@/lib/constants/cultivation/plants";
import { checkValue } from "@/lib/utils/formValidation";
import { checkEmpty } from "@/lib/utils/objects";
import { submitProductForm } from "@/lib/utils/production/products";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditProductPageComponent({ product, isEdit = true }) {
  const [productForm, setProductForm] = useState(initialData({ product }));
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    await submitProductForm({
      productForm,
      dispatch,
      router,
      isEdit,
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

export const EditProductForm = ({
  productForm,
  setProductForm,
  handleSubmit,
  isEdit = true,
}) => {
  const crops = useSelector((state) => state.cultivation.crops);
  const submitLabel = isEdit ? "Spremi promjene" : "Izradi proizvod";
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
          onChange={(e) => {
            const { value: val, error } = checkValue(e.target.value);
            if (error) {
              alert(error);
              return;
            }
            setProductForm({ ...productForm, price: val });
          }}
        />
        <AppInput
          label="Skladišni volumen"
          value={productForm.stockVolume}
          type="number"
          onChange={(e) => {
            const { value: val, error } = checkValue(e.target.value);
            if (error) {
              alert(error);
              return;
            }
            setProductForm({ ...productForm, stockVolume: val });
          }}
        />
        <ChooseCropVarietyItems
          crops={crops}
          cropsData={productForm}
          setCropsData={setProductForm}
          itemsName="ingredients"
          itemLabel="sastojak"
          emptyItem={emptyIngredient}
          additionalItemFields={[QuantityInput, QualityInput]}
        />
        <SubmitButton
          disabled={checkEmpty(productForm, true)}
          label={submitLabel}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export const QualityInput = ({ index, item, handleItemChange }) => (
  <AppSelect
    label="Kvaliteta"
    name="quality"
    onChange={(e) => handleItemChange(index, "quality", e.target.value)}
    value={item.quality}
    defaultValue={item.quality}
    options={VARIETIES_QUALITIES.map((quality) => ({
      label: quality,
      value: quality,
    }))}
  />
);

export const initialData = ({ product } = {}) => {
  if (!product) throw new Error("Proizvod za uređivanje nije pronađen");
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    ingredients: product.ingredients.map((ing) => ({
      ...ing,
      generalType: ing.cropVariety?.cropType?.generalType || "",
      type: ing.cropVariety?.cropType?._id || "",
      cropVariety: ing.cropVariety?._id || "",
      quantity: ing.quantity,
      quality: ing.quality || STANDARD,
    })),
    stockVolume: product.stockVolume,
  };
};

export const testProduct = ({ crops }) => ({
  name: `Proizvod ${new Date().toLocaleString()}`,
  description: "Opis proizvoda 1",
  price: 10,
  ingredients: testCropItemData({ crops }).map((item) => ({
    ...item,
    quantity: 1,
    quality: STANDARD,
  })),
  stockVolume: 1,
});

const emptyIngredient = {
  generalType: "",
  type: "",
  cropVariety: "",
  quantity: "",
  quality: STANDARD,
};
