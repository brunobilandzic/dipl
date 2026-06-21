import dbConnect from "@/lib/db/mongooseConnect";
import {
  CropMainType,
  CropGeneralType,
  CropType,
  CropVariety,
} from "@/models/sectors/cultivation/Crops";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { level } = body;

    if (level === "mainType") {
      const mainType = new CropMainType({ name: body.name });
      await mainType.save();
      const { ...mainTypeData } = mainType._doc;
      return Response.json({ level, mainType: mainTypeData }, { status: 200 });
    }

    if (level === "generalType") {
      const generalType = new CropGeneralType({
        name: body.name,
        description: body.description,
        mainCropType: body.mainCropType,
      });
      await generalType.save();

      const mainTypeDoc = await CropMainType.findById(body.mainCropType);
      mainTypeDoc.generalTypes.push(generalType._id);
      await mainTypeDoc.save();

      const { cropTypes, ...generalTypeData } = generalType._doc;
      return Response.json(
        {
          level,
          generalType: { ...generalTypeData, mainTypeName: mainTypeDoc.name },
        },
        { status: 200 },
      );
    }

    if (level === "cropType") {
      const cropType = new CropType({
        name: body.name,
        color: body.color,
        description: body.description,
        generalType: body.generalType,
      });
      await cropType.save();

      const createdVarieties = [];
      for (const variety of body.varieties || []) {
        if (!variety.name) continue;
        const cropVariety = new CropVariety({
          name: variety.name,
          shade: Number(variety.shade),
          quantityPerCell: Number(variety.quantityPerCell),
          cropType: cropType._id,
        });
        await cropVariety.save();
        cropType.cropVarieties.push(cropVariety._id);
        createdVarieties.push(cropVariety);
      }
      await cropType.save();

      const generalTypeDoc = await CropGeneralType.findById(body.generalType);
      generalTypeDoc.cropTypes.push(cropType._id);
      await generalTypeDoc.save();

      const { cropVarieties, ...typeData } = cropType._doc;
      const type = { ...typeData, generalTypeName: generalTypeDoc.name };
      const varieties = createdVarieties.map((cropVariety) => ({
        ...cropVariety._doc,
        cropTypeName: cropType.name,
      }));
      return Response.json({ level, type, varieties }, { status: 200 });
    }

    if (level === "cropVariety") {
      const cropTypeDoc = await CropType.findById(body.cropType);
      const cropVariety = new CropVariety({
        name: body.name,
        description: body.description,
        shade: Number(body.shade),
        quantityPerCell: Number(body.quantityPerCell),
        cropType: body.cropType,
      });
      await cropVariety.save();
      cropTypeDoc.cropVarieties.push(cropVariety._id);
      await cropTypeDoc.save();

      const variety = { ...cropVariety._doc, cropTypeName: cropTypeDoc.name };
      return Response.json({ level, variety }, { status: 200 });
    }

    throw new Error("Unknown crop level: " + level);
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
