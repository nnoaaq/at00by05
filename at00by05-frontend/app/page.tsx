import { getMeasurements } from "@/api/getMeasurements";
import { ChartComponent } from "@/components/chart";
import { notFound } from "next/navigation";
export const instant = false;
export default async function Home() {
  const measurements = await getMeasurements();
  if (measurements.length == 0) return notFound(); // OHJATAAN CUSTOM-404-SIVULLE
  return (
    <div className="border border-zinc-200 m-2 rounded-lg p-2 shadow-xs">
      <ChartComponent measurementsData={measurements} />
    </div>
  );
}
