import allCropTypes from "@/lib/constants/cultivation/plants";
import {
  CropGeneralType,
  CropMainType,
  CropType,
  CropVariety,
} from "@/models/sectors/cultivation/Crops";
import utils from "@/lib/utils";

// Seed crop main types, general types, types, and varieties

// main types

export async function seedCropMainTypes() {
  const cropMainTypesPromises = [];
  for (const [key, mainTypeData] of allCropTypes.entries()) {
    cropMainTypesPromises.push(createMainType(mainTypeData));
  }
  const mainTypes = await Promise.all(cropMainTypesPromises);
  console.log(`Created ${mainTypes.length} main crop types.`);
  return mainTypes;
}

async function createMainType(mainTypeData) {
  return new Promise(async (resolve, reject) => {
    const mainCropType = new CropMainType({
      name: mainTypeData.name,
    });
    if (!mainCropType) {
      return reject(`Failed to create main crop type: ${mainTypeData.name}`);
    }
    const generalTypes = await createCropGeneralTypes(
      mainCropType._id,
      mainTypeData.generalTypes,
    );

    resolve({ mainType: mainCropType.name, generalTypes });
    mainCropType.generalTypes = generalTypes.map((gt) => gt.generalTypeId);
    await mainCropType.save();
  });
}

// general types

async function createCropGeneralTypes(mainTypeId, generalTypesData) {
  const cropGeneralTypesPromises = [];
  for (const generalType of generalTypesData) {
    cropGeneralTypesPromises.push(
      createCropGeneralType(mainTypeId, generalType),
    );
  }
  const generalTypes = await Promise.all(cropGeneralTypesPromises);
  return generalTypes;
}

async function createCropGeneralType(mainTypeId, generalTypeData) {
  const dbGeneralTypeData = utils.objects.extractDBObject(generalTypeData);
  return new Promise(async (resolve, reject) => {
    const cropGeneralType = new CropGeneralType({
      mainType: mainTypeId,
      ...dbGeneralTypeData,
    });

    if (!cropGeneralType) {
      return reject(
        `Failed to create crop general type: ${generalTypeData.name}`,
      );
    }
    const cropTypes = await createCropTypes(
      cropGeneralType._id,
      generalTypeData.cropTypes,
    );
    cropGeneralType.cropTypes = cropTypes.map((ct) => ct.cropTypeId);
    await cropGeneralType.save();
    resolve({ generalTypeId: cropGeneralType._id, cropTypes });
  });
}

// types

async function createCropTypes(cropGeneralTypeId, cropTypesData) {
  const cropTypesPromises = [];
  for (const cropTypeData of cropTypesData) {
    cropTypesPromises.push(createCropType(cropGeneralTypeId, cropTypeData));
  }
  const cropTypes = await Promise.all(cropTypesPromises);
  return cropTypes;
}

async function createCropType(cropGeneralTypeId, cropTypeData) {
  return new Promise(async (resolve, reject) => {
    const cropType = new CropType({
      generalType: cropGeneralTypeId,
      ...cropTypeData,
    });

    await cropType.save();
    if (!cropType) {
      return reject(`Failed to create crop type: ${cropTypeData.name}`);
    }

    const cropVarietiesIds = await createCropVarieties(
      cropType._id,
      cropTypeData.cropVarieties,
    );
    cropType.cropVarieties = cropVarietiesIds;
    await cropType.save();
    resolve({ cropTypeId: cropType._id, cropVarieties: cropVarietiesIds });
  });
}

// varieties

async function createCropVarieties(cropTypeId, cropVarietiesData) {
  const cropVarietiesPromises = [];
  for (const varietyName of cropVarietiesData) {
    cropVarietiesPromises.push(createCropVariety(cropTypeId, varietyName));
  }
  const cropVarietiesIds = await Promise.all(cropVarietiesPromises);
  return cropVarietiesIds;
}

async function createCropVariety(cropTypeId, varietyName) {
  return new Promise(async (resolve, reject) => {
    const cropVariety = new CropVariety({
      cropType: cropTypeId,
      name: varietyName,
    });
    await cropVariety.save();
    if (!cropVariety) {
      return reject(`Failed to create crop variety: ${varietyName}`);
    }
    resolve(cropVariety._id);
  });
}

export function logMainTypes(mainTypes) {
  for (const mt of mainTypes) {
    console.log(
      `Created main type: ${mt.mainType} with ${mt.generalTypes.length} general types`,
    );
    for (const gt of mt.generalTypes) {
      console.log(
        `  Created general type ID: ${gt.generalTypeId} with ${gt.cropTypes.length} crop types`,
      );
      for (const ct of gt.cropTypes) {
        console.log(
          `    Created crop type ID: ${ct.cropTypeId} with ${ct.cropVarieties.length} varieties`,
        );
      }
    }
  }
}
