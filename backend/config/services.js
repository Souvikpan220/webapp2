export const premiumServices = {
  kaddu1: { amount: 1000, serviceId: process.env.SMM_SERVICE_KADDU1 || "2010", keyFile: "kaddu1.json" },
  kaddu2: { amount: 500, serviceId: process.env.SMM_SERVICE_KADDU2 || "2020", keyFile: "kaddu2.json" },
  kaddu3: { amount: 100, serviceId: process.env.SMM_SERVICE_KADDU3 || "2030", keyFile: "kaddu3.json" }
};

export const freeService = {
  amount: 100,
  serviceId: process.env.SMM_FREE_SERVICE_ID || "1010"
};
