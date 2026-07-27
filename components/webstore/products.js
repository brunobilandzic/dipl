import { useDispatch, useSelector } from "react-redux";
import { LoadingFullScreen } from "../layout/loading";
import { AppTile, AppTilesGrid } from "../layout/preview/tile";
import { getIngredientsList } from "@/lib/utils/production/products";
import { useEffect, useState } from "react";
import { AddToCartButton } from "./cart";
import { addToCartRedux, refreshProductsThunk } from "@/store/webstore";
import { productInCart } from "@/lib/utils/webstore/cart";
import { priceEuroString } from "@/lib/utils/strings";

export const ProductList = ({}) => {
  const products = useSelector(
    (state) => state.webstore.products.filteredItems,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!products) dispatch(refreshProductsThunk());
  }, [products]);

  if (!products) {
    return <LoadingFullScreen />;
  }

  return (
    <div>
      <ProductsTilesGrid products={products} />
    </div>
  );
};

const ProductsTilesGrid = ({ title, products }) => {
  return (
    <>
      <div>
        <AppTilesGrid>
          {products.map((product, index) => (
            <ProductTile key={index} index={index} product={product} />
          ))}
        </AppTilesGrid>
      </div>
    </>
  );
};

function ProductTile({ index, product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.webstore.cart.items);
  const [cartQuantity, setCartQuantity] = useState(
    productInCart({
      productId: product._id,
      cartItems: cartItems,
    }) || "",
  );
  const addToCart = () => {
    dispatch(addToCartRedux({ product, quantity: cartQuantity }));
  };
  useEffect(() => {
    setCartQuantity(
      productInCart({
        productId: product._id,
        cartItems: cartItems,
      }) || "",
    );
  }, [cartItems]);

  const productActions = [
    {
      component: (
        <AddToCartButton
          cartQuantity={cartQuantity}
          setCartQuantity={setCartQuantity}
          addToCart={addToCart}
        />
      ),
      onClick: () => {
        console.log("adding to cart");
      },
    },
  ];

  return (
    <AppTile key={index} tile={product}>
      <div className=" flex flex-col justify-between h-full min-w-[130px]">
        <div className="">
          <h3 className="listitemheader">{product.name}</h3>
          <p className="listitemDescription break-words line-clamp-20">
            {product.description}
          </p>
        </div>

        <div>
          {" "}
          <div className="text-sm text-gray-500 my-1">
            Sastojci: {getIngredientsList({ ingredients: product.ingredients })}
          </div>
          <div className="flex justify-between items-center h-fit">
            <p className="text-xl font-bold text-green-700">
              {priceEuroString(product.price)}
            </p>
            <div>
              <ProductActions actions={productActions} />
            </div>
          </div>
        </div>
      </div>
    </AppTile>
  );
}

const ProductActions = ({ actions }) => {
  return (
    <div>
      {actions.map((action, index) => (
        <div className="" key={index}>
          {action.component}
        </div>
      ))}
    </div>
  );
};
