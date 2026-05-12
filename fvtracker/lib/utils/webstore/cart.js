export const productInCart = ({ productId, cartItems }) => {
  const productItem = cartItems.find((item) => item.product.id === productId);
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
  console.log({ cartItems });
  if (cartItems.length > 0) {
    return;
  }
  const localCart = getCartFromLocalStorage();
  console.log({ localCart });
  if (localCart && localCart.items) {
    localCart.items.forEach((item) => {
      dispatch(
        addToCartRedux({ product: item.product, quantity: item.quantity }),
      );
    });
  }
};
