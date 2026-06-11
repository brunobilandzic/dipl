import React from "react";

export const SubmitButton = ({ handleSubmit, label = "Spremi promjene" , disabled}) => {
  return (
    <div>
      <button onClick={handleSubmit} disabled={disabled} className="mt-4 btn submitButton disabled:opacity-50 disabled:cursor-not-allowed" >
        {label}
      </button>
    </div>
  );
};

export default SubmitButton;
