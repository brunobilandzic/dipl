import { fillReduxCart } from "@/store/webstore";

export const productInCart = ({ productId, cartItems }) => {
  const productItem = cartItems?.find((item) => item.product._id === productId);
  return productItem ? productItem.quantity : null;
};

export const setCartToLocalStorege = ({ cart }) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : null;
};

export const fillCartRedux = ({ dispatch, cartItems }) => {
  if (cartItems.length > 0) {
    return;
  }
  const localCart = getCartFromLocalStorage();
  if (localCart && localCart.items) {
    dispatch(fillReduxCart(localCart.items));
  }
};
