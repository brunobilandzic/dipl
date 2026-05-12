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

export const fillCartRedux = ({ dispatch, useSelector }) => {
  const cartItems = useSelector((state) => state.webstore.cart.items);
  useEffect(() => {
    if (cartItems.length > 0) {
      return;
    }
    const localCart = getCartFromLocalStorage();
    if (localCart && localCart.items) {
      localCart.items.forEach((item) => {
        dispatch(
          addToCartRedux({ product: item.product, quantity: item.quantity }),
        );
      });
    }
  }, [dispatch]);
};
