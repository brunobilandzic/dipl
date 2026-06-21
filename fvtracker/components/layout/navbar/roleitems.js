import { FaShoppingCart } from "@react-icons/all-files/fa/FaShoppingCart";

export default {
  GeneralManager: [
    {
      label: "izvještaji",
      path: "/izvjestaji",
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
      label: "izvještaji",
      path: "/izvjestaji",
    },
    {
      label: "upravljanje poljima",
      submenu: [
        { label: "pregled", path: "/upravljanje-poljima/pregled" },
        { label: "dodavanje", path: "/upravljanje-poljima/dodavanje" },
        { label: "žetve", path: "/upravljanje-poljima/pregled/zetve" },
      ],
    },
    {
      label: "kulture",
      submenu: [
        { label: "pregled", path: "/kulture" },
        { label: "dodavanje", path: "/kulture/dodavanje" },
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
      label: "izvještaji",
      path: "/izvjestaji",
    },
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
      label: "izvještaji",
      path: "/izvjestaji",
    },
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
      label: "izvještaji",
      path: "/izvjestaji",
    },
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
    label: "menadžeri",
    submenu: [
      { label: "pregled", path: "/menadzeri" },
      { label: "zahtjevi", path: "/menadzeri/zahtjevi" },
    ],
  },
  {
    label: "generalni menadžer",
    path: "/zahtjevi/generalni-menadzer",
  },
  {
    label: "radnici",
    submenu: [
      { label: "pregled", path: "/radnici" },
      { label: "zapošljavanje", path: "/radnici/zaposljavanje" },
    ],
  },
];

export const guestNavItems = [
  {
    label: (
      <div className="flex items-center gap-2">
        Košarica{" "}
        <div className="-mt-0.5">
          <FaShoppingCart />
        </div>
      </div>
    ),
    path: "/kosarica",
  },
];
