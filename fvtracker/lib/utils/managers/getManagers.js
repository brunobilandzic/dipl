export const getSpecificManager = async ({ managerName, managers }) => {
  const manager = managers.find((m) => m.managerModelName === managerName);
  if (!manager) {
    throw new Error(
      `Manager with name ${managerName} not found in provided managers`,
    );
  }
  return manager;
};
