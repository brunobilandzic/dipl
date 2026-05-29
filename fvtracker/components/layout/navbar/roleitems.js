import { FaShoppingCart } from "react-icons/fa";

export default {
  GeneralManager: [
    {
      label: "pregled",
      path: "/pregled",
    },
    {
      label: "menadzeri",
      submenu: [
        { label: "pregled", path: "/menadzeri" },
        { label: "zahtjevi", path: "/menadzeri/zahtjevi" },
      ],
    },
    {
      label: "radnici",
      path: "/radnici",
    },
    {
      label: "nabava",
      submenu: [
        { label: "lista", path: "/nabava/lista" },
        { label: "zahtjevi", path: "/nabava/zahtjevi" },
        { label: "novi dobavljač", path: "/nabava/novi" },
      ],
    },
  ],
  CultivationManager: [
    {
      label: "upravljanje poljima",
      submenu: [
        { label: "pregled", path: "/upravljanje-poljima/pregled" },
        { label: "dodavanje", path: "/upravljanje-poljima/dodavanje" },
        { label: "žetve", path: "/upravljanje-poljima/pregled/zetve" },
      ],
    },
    {
      label: "planiranje",
      submenu: [
        { label: "plan sadnje", path: "/plan-sadnje" },
        { label: "plan berbe", path: "/plan-berbe" },
      ],
    },
    {
      label: "radnici",
      path: "/radnici",
    },
    {
      label: "nabava",
      submenu: [
        { label: "lista", path: "/nabava/lista" },
        { label: "zahtjevi", path: "/nabava/zahtjevi" },
        { label: "novi dobavljač", path: "/nabava/novi" },
      ],
    },
  ],
  ProductionManager: [
    {
      label: "proizvodnja",
      submenu: [
        { label: "proizvodi", path: "/proizvodi" },
        { label: "sirovine", path: "/sirovine" },
        { label: "zalihe", path: "/proizvodi/zalihe" },
      ],
    },
    {
      label: "postrojenja",
      path: "/postrojenja",
    },
    {
      label: "radnici",
      path: "/radnici",
    },
    {
      label: "nabava",
      submenu: [
        { label: "lista", path: "/nabava/lista" },
        { label: "zahtjevi", path: "/nabava/zahtjevi" },
        { label: "novi dobavljač", path: "/nabava/novi" },
      ],
    },
  ],
  WarehouseManager: [
    {
      label: "skladište",
      submenu: [
        { label: "jedinice", path: "/skladisne-jedinice" },
        { label: "zahtjevi", path: "/skladiste-zahtjevi" },
      ],
    },
    {
      label: "radnici",
      path: "/radnici",
    },
    {
      label: "nabava",
      submenu: [
        { label: "lista", path: "/nabava/lista" },
        { label: "zahtjevi", path: "/nabava/zahtjevi" },
        { label: "novi dobavljač", path: "/nabava/novi" },
      ],
    },
  ],
  FinancialManager: [
    {
      label: "narudžbe",
      submenu: [
        { label: "pregled", path: "/narudzbe" },
        { label: "otpremnice", path: "/otpremnice" },
      ],
    },
    {
      label: "računi",
      path: "/racuni",
    },
    {
      label: "izvještaji",
      path: "/izvjestaji",
    },
    ,
    {
      label: "radnici",
      path: "/radnici",
    },
    {
      label: "nabava",
      submenu: [
        { label: "lista", path: "/nabava/lista" },
        { label: "zahtjevi", path: "/nabava/zahtjevi" },
        { label: "novi dobavljač", path: "/nabava/novi" },
      ],
    },
  ],
};

export const adminNavItems = [
  {
    label: "zahtjevi",
    path: "/zahtjevi/generalni-menadzer",
  },
];

export const workerNavItems = {
  cultivation: {
    label: "Kultivacija",
    path: "/upravljanje-poljima/pregled",
  },
};
export const guestNavItems = [
  {
    label: (
      <div className="text-2xl">
        <FaShoppingCart />
      </div>
    ),
    path: "/kosarica",
  },
];
