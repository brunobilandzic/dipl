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
      submenu: [
        { label: "pregled", path: "/radnici" },
        { label: "zapošljavanje", path: "/radnici/zaposljavanje" },
      ],
    },
    {
      label: "nabava",
      path: "/nabava",
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
      path: "/nabava",
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
      path: "/nabava",
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
      path: "/nabava",
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
    /* {
      label: "računi",
      path: "/racuni",
    },
    {
      label: "izvještaji",
      path: "/izvjestaji",
    }, */
    {
      label: "radnici",
      submenu: [
        { label: "pregled", path: "/radnici" },
        { label: "zapošljavanje", path: "/radnici/zaposljavanje" },
      ],
    },
    {
      label: "nabava",
      path: "/nabava",
    },
  ],
  CultivationWorker: [
    {
      label: "Kultivacija",
      path: "/upravljanje-poljima/pregled",
    },
  ],
  ProductionWorker: [
    {
      label: "Proizvodi",
      path: "/proizvodi",
    },
  ],
  WarehouseWorker: [
    {
      label: "Otpremnice",
      path: "/skladiste-zahtjevi",
    },
  ],
  FinancialWorker: [
    {
      label: "Narudžbe",
      path: "/narudzbe",
    },
    {
      label: "Otpremnice",
      path: "/otpremnice",
    },
  ],
};

export const adminNavItems = [
  {
    label: "zahtjevi",
    path: "/zahtjevi/generalni-menadzer",
  },
];

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
