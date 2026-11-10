import { getMeasurements } from "@/api/getMeasurements";
import { ChartComponent } from "@/components/chart";
import { notFound } from "next/navigation";
import { connection } from "next/server";
export const instant = false;
export default async function Home() {
  await connection();
  const measurements = await getMeasurements();
  if (measurements.length == 0) return notFound(); // OHJATAAN CUSTOM-404-SIVULLE
  return (
    <div className="border border-zinc-600 m-2 rounded-lg p-2 shadow-xs bg-zinc-800">
      <ChartComponent measurementsData={measurements} />
    </div>
  );
}
