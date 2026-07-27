"use client";

import { ProductList } from "@/components/webstore/products";

export default function TrgovinaPage() {
  return (
    <div>
      <div className="text-2xl font-bold mb-2">
        Web trgovina — voće i povrće
      </div>
      <p className="text-gray-600 mb-6">
        Izaberite proizvod i dodajte ga u košaricu, zatim otvorite košaricu i
        slijedite upute za dovršetak narudžbe.
      </p>
      <ProductList />
    </div>
  );
}
