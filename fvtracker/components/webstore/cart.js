export const AddToCartQuantity = ({ quantity, setQuantity }) => {
  const onChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };
  return (
    <>
      <div className="absolute w-4 top-0 left-0">
        <input type="number" onChange={onChange} />
      </div>
    </>
  );
};
