export const productInCart = ({ productId, cartItems }) => {
  const productItem = cartItems.find((item) => item.product.id === productId);
  return productItem ? productItem.quantity : null;
};
