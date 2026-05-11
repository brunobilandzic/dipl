export const Store = () => {
  const products = useSelector(
    (state) => state.production.products.filteredItems,
  );
};
