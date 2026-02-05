export default {
  admin: [
    {
      label: "korisnici",
      path: "/korisnici",
    },
  ],
  GeneralManager: [
    {
      label: "odjeli",
      submenu: [
        { label: "kultivacija", path: "/odjeli/kultivacija" },
        { label: "procesuiranje", path: "/odjeli/procesuiranje" },
        { label: "skladištenje", path: "/odjeli/skladistenje" },
        { label: "prodaja", path: "/odjeli/prodaja" },
      ],
    },
    {
      label: "menadžeri",
      submenu: [
        { label: "lista", path: "/menadzeri/lista" },
        { label: "postavljanje", path: "/menadzeri/postavljanje" },
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
  CultivationManager: [
    {
      label: "upravljanje poljima",
      submenu: [
        { label: "pregled", path: "/upravljanje-poljima/pregled" },
        { label: "dodavanje", path: "/upravljanje-poljima/dodavanje" },
      ],
    },
    {
      label: "kultivacija",
      submenu: [
        { label: "sadnja", path: "/kultivacija/sadnja" },
        { label: "berba", path: "/kultivacija/berba" },
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
      label: "postrojenja",
      path: "/postrojenja",
    },
    {
      label: "proizvodnja",
      submenu: [
        { label: "zaprimanja", path: "/proizvodnja/zaprimanja" },
        { label: "procesuirenje", path: "/proizvodnja/procesuirenje" },
        { label: "slanje", path: "/proizvodnja/slanje" },
      ],
    },
    {
      label: "zapošljavanje",
      path: "/zaposljavanjе",
    },
    {
      label: "nabava",
      path: "/nabava",
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
      label: "nabava",
      path: "/nabava",
    },
    {
      label: "zaposlenici",
      path: "/zaposlenici",
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
  ],
};
