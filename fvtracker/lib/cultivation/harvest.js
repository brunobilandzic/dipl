import { getCultivationById } from "./cultivation";

export async function harvestRelativeCells({
    cultivationId,
    cropVarietyId,
    plantingPlanId,
}) {
    const cultivation = await getCultivationById(cultivationId);
    await cultivation.populate({ path: "cultivationArea", select: "planted" });

 }