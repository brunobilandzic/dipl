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
        { label: "zetve", path: "/upravljanje-poljima/pregled/zetve" },
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
        { label: "žetve", path: "/upravljanje-poljima/pregled/zetve" },
        { label: "zaprimanja", path: "/proizvodnja/zaprimanja" },
        { label: "procesuirenje", path: "/proizvodnja/procesuirenje" },
        { label: "slanje", path: "/proizvodnja/slanje" },
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
      label: "pregled",
      submenu: [
        { label: "stanje", path: "/pregled/stanje" },
        { label: "raspored", path: "/pregled/raspored" },
      ],
    },
    {
      label: "zahtjevi",
      path: "/zahtjevi",
    },
    {
      label: "primke",
      path: "/primke",
    },
    {
      label: "otpremnice",
      path: "/otpremnice",
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
