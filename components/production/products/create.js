"use client";

import React, { useEffect, useState } from "react";
import { EditProductForm, testProduct } from "./edit";
import { submitProductForm } from "@/lib/utils/production/products";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const CreateProductPageComponent = () => {
  const crops = useSelector((state) => state.cultivation.crops);
  const [productForm, setProductForm] = useState(testProduct({ crops }));
  useEffect(() => {
    if (crops) {
      setProductForm(testProduct({ crops }));
    }
  }, [crops]);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSubmit = async () => {
    await submitProductForm({
      productForm,
      dispatch,
      router,
    });
  };
  return (
    <div>
      <div>
        <EditProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          handleSubmit={handleSubmit}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default CreateProductPageComponent;
