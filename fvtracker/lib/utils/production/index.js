import api from "@/lib/api";

export default async function fillProductionRedux() {
  try {
    await api.get("/production");
  } catch (error) {}
}
