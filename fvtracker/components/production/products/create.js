"use client";

import React, { useState } from "react";
import { EditProductForm, initialData } from "./edit";
import { submitProductForm } from "@/lib/utils/production/products";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const CreateProductPageComponent = () => {
  const [productForm, setProductForm] = useState(initialData());
  const dispatch = useDispatch();
  const router = useRouter();
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
