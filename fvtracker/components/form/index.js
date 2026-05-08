import React from "react";

export const SubmitButton = ({ handleSubmit, label = "Spremi promjene" }) => {
  return (
    <div>
      <div onClick={handleSubmit} className="mt-4 btn submitButton">
        {label}
      </div>
    </div>
  );
};

export default SubmitButton;
