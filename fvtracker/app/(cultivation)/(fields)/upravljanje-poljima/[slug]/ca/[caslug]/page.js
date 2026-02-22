import { CultivationAreaPageComponent } from "@/components/cultivation/cultivationArea";

export default async function FieldCultivationAreaPage({ params }) {
  const { slug, caslug } = await params;

  return <CultivationAreaPageComponent fieldSlug={slug} caSlug={caslug} />;
}
