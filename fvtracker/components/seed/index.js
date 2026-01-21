import React from "react";
import { FaSeedling } from "react-icons/fa";
import SeedOptions from "./options";

function SeedPageComponent() {
  return (
    <div className="flex flex-col gap-16">
      <div className="header-lg   ">
        <div className="title text-center">Seed Documents</div>
        <div className="header-icon">
          <FaSeedling />
        </div>
      </div>
      <div className="">
        <SeedOptions />
      </div>
    </div>
  );
}

export default SeedPageComponent;
