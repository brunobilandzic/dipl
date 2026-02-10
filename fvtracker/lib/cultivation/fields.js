import { Field } from "@/models/sectors/cultivation/Field";
import dbConnect from "@/lib/db/mongooseConnect";
await dbConnect();

export async function fieldsList(filter) {
  const fields = await Field.find(filter).sort({ createdAt: -1 });
  if (!fields || fields.length === 0) {
    throw new Error("No fields found");
  }
  return fields;
}

export async function fetchFieldBySlug(slug) {
  const field = await Field.findOne({ slug });
  if (!field) {
    throw new Error("Field not found");
  }
  return field;
}
