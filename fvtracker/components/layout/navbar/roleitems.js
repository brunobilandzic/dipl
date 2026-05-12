import { FaShoppingCart } from "react-icons/fa";

export default {
  admin: [
    {
      label: "korisnici",
      path: "/korisnici",
    },
  ],
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
        { label: "lista", path: "/radnici" },
        { label: "zahtjevi", path: "/radnici/zahtjevi" },
        { label: "novi radnik", path: "/radnici/novi" },
      ],
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
      submenu: [
        { label: "lista", path: "/radnici" },
        { label: "zahtjevi", path: "/radnici/zahtjevi" },
        { label: "novi radnik", path: "/radnici/novi" },
      ],
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
      submenu: [
        { label: "lista", path: "/radnici" },
        { label: "zahtjevi", path: "/radnici/zahtjevi" },
        { label: "novi radnik", path: "/radnici/novi" },
      ],
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
      submenu: [{ label: "jedinice", path: "/skladisne-jedinice" }],
    },
    {
      label: "radnici",
      submenu: [
        { label: "lista", path: "/radnici" },
        { label: "zahtjevi", path: "/radnici/zahtjevi" },
        { label: "novi radnik", path: "/radnici/novi" },
      ],
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
  FinanceManager: [
    {
      label: "narudžbe",
      path: "/narudzbe",
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
      submenu: [
        { label: "lista", path: "/radnici" },
        { label: "zahtjevi", path: "/radnici/zahtjevi" },
        { label: "novi radnik", path: "/radnici/novi" },
      ],
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
