export const fieldPlantedStatistics = (field) => {
  const cultivationAreas = field.cultivationAreas || [];
  const caCells = [];
  const plantedCropVarieties = [];
  const plantedPlCvs = [];
  const emptyPlCvs = [];

  cultivationAreas.map((ca) => {
    caCells.push(...ca.planted);
    ca.cultivations.map((cu) => {
      cu.plantedCropVarieties.map((pcv) => {
        if (pcv.cropVariety) plantedPlCvs.push(pcv);
        else emptyPlCvs.push(pcv);
      });
    });
  });

  return {
    totalCACells: caCells.length,
    plantedPlCvs,
    emptyPlCvs,
  };
};

export const prepareSubmitPlan = (plan) => {
  const mergedItems = {};
  plan.items.forEach((item) => {
    const key = item.cropVariety;
    if (mergedItems[key]) {
      mergedItems[key].quantity += item.quantity;
    } else {
      mergedItems[key] = { cropVariety: key, quantity: item.quantity };
    }
  });
  plan.items = Object.values(mergedItems);
  const { items: _items, ...rest } = plan;

  const items = plan.items.map((item) => ({
    cropVariety: item.cropVariety,
    quantity: item.quantity,
  }));

  return {
    ...rest,
    items,
  };
};


