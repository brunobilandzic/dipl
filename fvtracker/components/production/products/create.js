import React from "react";

const CreateProductPage = () => {
  const [productForm, setProductForm] = useState(testProduct);
  return <div>CreateProductPage</div>;
};

export default CreateProductPage;

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
