"use client";

import { preventEvent } from "@/lib/utils/dev";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { List } from "../layout/preview/list";
import { useSelector } from "react-redux";

export const CartPageComponent = () => {
  const cart = useSelector((state) => state.webstore.cart);
  const [cartItems, setCartItems] = useState(cart.items);

  return (
    <List
      title={
        <div className="flex items-center gap-">
          <span>Košarica </span>
          <FaShoppingCart />
        </div>
      }
    ></List>
  );
};

const CartItem = ({ cartItem }) => {
  const { product, quantity } = cartItem;
  return (
    <>
      <div>
        <div>{product.name}</div>
      </div>
    </>
  );
};

export const AddToCartQuantity = ({
  quantity,
  setQuantity,
  addToCart,
  setAddToCartClicked,
}) => {
  const onChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setQuantity(null);
    } else {
      setQuantity(Number.parseInt(e.target.value));
    }
  };

  const submitClick = (e) => {
    preventEvent(e);
    addToCart(quantity);
    setAddToCartClicked(false);
  };

  return (
    <>
      <div className="absolute border rounded-lg flex flex-col items-center gap-2 top-2 left-2  py-2 px-4 bg-slate-900 ">
        <input
          type="number"
          value={quantity}
          onChange={onChange}
          onClick={(e) => e.stopPropagation()}
          className="w-full"
        />
        <div onClick={submitClick} className="btn submitButton btnSm">
          Dodaj
        </div>
      </div>
    </>
  );
};

export const AddToCartButton = ({
  onClick,
  cartQuantity,
  setCartQuantity,
  addToCart,
}) => {
  const [addToCartClicked, setAddToCartClicked] = useState(false);

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setAddToCartClicked(!addToCartClicked);
        }}
        className="relative"
      >
        {addToCartClicked && (
          <AddToCartQuantity
            quantity={cartQuantity}
            setQuantity={setCartQuantity}
            addToCart={addToCart}
            setAddToCartClicked={setAddToCartClicked}
          />
        )}
        <div className="flex justify-center gap-1 items-center">
          <div>
            <FaShoppingCart />
          </div>
          <div className="font-bold mt-1">{cartQuantity}</div>
        </div>
      </div>
    </>
  );
};
