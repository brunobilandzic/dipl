export const getCropOptions = ({ crops, existingFilters }) => {
  const mainTypeOptions = crops?.mainTypes?.map((mt) => ({
    label: mt.name,
    value: mt.name,
  }));

  const filtersMap = existingFilters?.reduce((map, filter) => {
    map.set(filter.type, filter.value);
    return map;
  }, new Map());

  console.log("filtersMap", filtersMap);

  const generalTypeOptions = crops?.generalTypes
    ?.filter((gt) => {
      const mainTypeFilter = filtersMap.get("mainType");
      if (mainTypeFilter && gt.mainTypeName !== mainTypeFilter) {
        return false;
      }
      return true;
    })
    .map((gt) => ({
      label: gt.name,
      value: gt.name,
    }));
  const cropTypeOptions = crops?.types
    ?.filter((ct) => {
      const generalTypeFilter = filtersMap.get("generalType");
      if (generalTypeFilter && ct.generalTypeName !== generalTypeFilter) {
        return false;
      }
      return true;
    })
    .map((ct) => ({
      label: ct.name,
      value: ct.name,
    }));
  return {
    mainTypeOptions,
    generalTypeOptions,
    cropTypeOptions,
  };
};
