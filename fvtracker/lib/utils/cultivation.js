export function getCUSCells(cultivations) {
    const cells = [];

    cultivations.forEach((cultivation) => {
        cultivation.plantedCropVarieties.forEach((pcv) => {
            if (pcv.relativeCoords) {
                cells.push(pcv.relativeCoords);
            }
        });
    });

    return cells;
}