"use client";

import { preventEvent } from "@/lib/utils/dev";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "@react-icons/all-files/fa/FaShoppingCart";
import { List } from "../layout/preview/list";
import { useSelector, useDispatch } from "react-redux";
import { changeQuantity, emptyCart, removeFromCart } from "@/store/webstore";
import { FaXbox } from "@react-icons/all-files/fa/FaXbox";
import { CustomerInfoForm } from "./checkout";
import { sendOrder } from "@/lib/utils/webstore/orders";
import { checkValue } from "@/lib/utils/formValidation";

export const CartPageComponent = () => {
  const initialCustomer = {
    name: "a",
    surname: "b",
    email: "c@c",
    address: "d",
  };
  const [customerData, setCustomerData] = useState(initialCustomer);
  const [fillInfo, setFillInfo] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.webstore.cart.items);

  const placeOrder = () => {
    sendOrder({ customerData, cartItems });
    setFillInfo(false);
    // dispatch(emptyCart());
  };

  const onQuantityChange = (cartItem, quantity) => {
    if (quantity == "") {
      if (!confirm("Želite li ukloniti proizvod iz košarice?")) return;
      dispatch(removeFromCart(cartItem.product._id));
      return;
    }
    dispatch(changeQuantity({ productId: cartItem.product._id, quantity }));
  };
  const cartActionButtons = [
    <div
      className="btn cancelButton btnSm"
      onClick={() => dispatch(emptyCart())}
      key="isprazni"
    >
      Isprazni
    </div>,
    <div
      className="btn submitButton btnSm"
      onClick={() => setFillInfo(true)}
      key="naruči"
    >
      Naruči
    </div>,
  ];
  return (
    <>
      <List
        title={
          <div className="flex items-center gap-2">
            <span>Košarica </span>
            <FaShoppingCart />
          </div>
        }
        customButtons={cartActionButtons}
      >
        {cartItems?.map((cartItem, index) => {
          return (
            <CartItem
              key={index}
              cartItem={cartItem}
              onQuantityChange={onQuantityChange}
            />
          );
        })}
      </List>
      {fillInfo && (
        <CustomerInfoForm
          isOpen={fillInfo}
          onCancel={() => setFillInfo(false)}
          customerData={customerData}
          setCustomerData={setCustomerData}
          submitOrder={placeOrder}
        />
      )}
    </>
  );
};

const CartItem = ({ cartItem, onQuantityChange }) => {
  const dispatch = useDispatch();
  const { product, quantity: quantityProp } = cartItem;
  const [quantity, setQuantity] = useState(quantityProp);
  const quantityEdit = (newQuantity, e) => {
    preventEvent(e);
    onQuantityChange(cartItem, newQuantity);
  };
  const onRemove = (e) => {
    dispatch(removeFromCart(cartItem.product._id));
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="listitemheader flex items-center gap-4">
          <div>
            <FaXbox
              className="cursor-pointer hover:text-red-500"
              onClick={onRemove}
            />
          </div>
          <div className="text-lg font-bold">{product.name}</div>
        </div>
        <div>
          <CartItemQuantity
            quantity={quantity}
            setQuantity={setQuantity}
            quantityEdit={quantityEdit}
          />
        </div>
      </div>
    </>
  );
};

const CartItemQuantity = ({ quantity, setQuantity, quantityEdit }) => {
  return (
    <>
      <div className="w-14">
        <input
          className="w-full text-center p-2 rounded-lg"
          type="number"
          onChange={(e) => {
            const { value, error } = checkValue(e.target.value);
            if (error) {
              alert(error);
            }
            setQuantity(value);
            quantityEdit(value, e);
          }}
          value={quantity}
        />
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
    const { value, error } = checkValue(e.target.value);
    if (error) {
      alert(error);
      setQuantity(value);
    }

    setQuantity(value);
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
