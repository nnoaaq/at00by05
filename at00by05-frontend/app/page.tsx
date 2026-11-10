import { getMeasurements } from "@/api/getMeasurements";
import { ChartComponent } from "@/components/Chart";
import { SensorContainer } from "@/components/SensorContainer";
import { MeasurementType } from "@/types/measurement";
import { notFound } from "next/navigation";
import { connection } from "next/server";
export const instant = false;
export default async function Home() {
  await connection();
  const initialMeasurements: MeasurementType[] = await getMeasurements(); // KAIKKI MITTAUKSET (!!!!TOISTAISEKSI!!!!)
  if (initialMeasurements.length == 0) return notFound(); // DATAA EI LÖYTYNYT > OHJATAAN 404-SIVULLE

  // LAJITELLAAN MITTAUKSET MAPPIIN
  // SENSORID TAKAA LÖYTYY KAIKKI KYSEISEN SENSORIN MITTAUKSET
  const measurementsMap = new Map<string, MeasurementType[]>();
  for (const measurement of initialMeasurements) {
    const measurementsArray = measurementsMap.get(measurement.sensorId) ?? [];
    // TYÖNNETÄÄN TAULUKKOON MITTAUSTULOS
    measurementsArray.push(measurement);
    // ASETETAAN TAULUKKO MAPPIIN SENSORID TAAKSE
    measurementsMap.set(measurement.sensorId, measurementsArray);
  }
  // INITIALMEASUREMENTS ON NYT LAJITELTU MAPPIIN

  // POIMITAAN SENSORIT OMAKSI LISTAKSI
  // [
  //   { sensorId: 'AABBCC', sensorName: 'TESTI_YKSIN' },
  //   { sensorId: 'PetriPico', sensorName: 'Pico_2_w_DHT' }
  // ]

  const sensors = Array.from(measurementsMap.entries()).map(
    ([sensorId, sensorMeasurements]) => {
      return {
        sensorId: sensorId,
        sensorName: sensorMeasurements[0]?.sensorName ?? "",
      };
    },
  );

  return (
    <div className="border border-zinc-600 m-2 rounded-lg p-2 shadow-xs bg-zinc-800">
      <SensorContainer sensors={sensors} measurements={measurementsMap} />
    </div>
  );
}
