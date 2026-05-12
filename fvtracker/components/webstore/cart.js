import { preventEvent } from "@/lib/utils/dev";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

export const AddToCartQuantity = ({
  quantity,
  setQuantity,
  submitQuantity,
}) => {
  const onChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setQuantity(null);
    } else {
      setQuantity(value);
    }
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
        <div
          onClick={(e) => {
            preventEvent(e);
            submitQuantity(quantity);
          }}
          className="btn submitButton btnSm"
        >
          Dodaj
        </div>
      </div>
    </>
  );
};
      </div>
    </>
  );
};
