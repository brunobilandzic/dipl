export const EMPLOYMENT_STATUS_EMPLOYED = "zaposlen";
export const EMPLOYMENT_STATUS_UNEMPLOYED = "nezaposlen";
export const EMPLOYMENT_STATUS_PENDING = "na čekanju";

export const EMPLOYMENT_STATUSES = [
  EMPLOYMENT_STATUS_EMPLOYED,
  EMPLOYMENT_STATUS_UNEMPLOYED,
  EMPLOYMENT_STATUS_PENDING,
];

export const WORKER_TRANSLATION = {
  [EMPLOYMENT_STATUS_EMPLOYED]: "Zaposlen",
  [EMPLOYMENT_STATUS_UNEMPLOYED]: "Nezaposlen",
  [EMPLOYMENT_STATUS_PENDING]: "Na čekanju",

  WarehouseWorker: "Radnik skladišta",
  CultivationWorker: "Radnik u uzgoju",
  ProductionWorker: "Radnik u proizvodnji",
  FinancialWorker: "Radnik u financijama",
};
