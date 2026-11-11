"use client";

import { MeasurementType } from "@/types/measurement";
import { SensorsType } from "@/types/sensors";
import { useEffect, useState } from "react";
import { SelectSensor } from "./SelectSensor";
import { ChartComponent } from "./Chart";
import { DatePickerWithRange } from "./DatePicker";
import { getMeasurementsFromDays } from "@/api/getMeasurements";

// TILANHALLINTA TÄSSÄ TIEDOSTOSSA
// Chart.tsx (ChartComponent) >> NÄYTTÄÄ VALMIIN DATAN
// SelectSensor.tsx (SelectSensor) >> MAHDOLLISTAA VALITUN SENSORIN VAIHDON
export const SensorContainer = ({
  sensors,
  measurements,
}: {
  sensors: SensorsType[];
  measurements: Map<string, MeasurementType[]>;
}) => {
  // USESTATE VALITULLE SENSORILLE
  // DEFAULT = ENSIMMÄINEN LÖYTYNYT SENSORI
  const [selectedSensor, setSelectedSensor] = useState(
    sensors[0]?.sensorId ?? "",
  );
  const [selectedDays, setSelectedDays] = useState<
    { from: number; to: number } | undefined
  >(undefined);
  const [measurementsMap, setMeasurementsMap] = useState(measurements);
  useEffect(() => {
    const fetch = async () => {
      if (selectedDays?.from && selectedDays.to) {
        const foundMeasurements: MeasurementType[] =
          await getMeasurementsFromDays(
            selectedDays?.from,
            selectedDays?.to,
            selectedSensor,
          );
        setMeasurementsMap((prevMap) => {
          const newMap = new Map(prevMap);
          const existingArray = newMap.get(selectedSensor) ?? [];
          const combinedArrays = [...existingArray];

          // Lisätään vain ne, joita ei vielä ole entuudestaan (vältetään tuplat)
          foundMeasurements.forEach((m) => {
            if (
              !combinedArrays.some((item) => item.timeStamp === m.timeStamp)
            ) {
              combinedArrays.push(m);
            }
          });

          newMap.set(selectedSensor, combinedArrays);
          return newMap;
        });
      }
    };
    fetch();
  }, [selectedDays]);

  return (
    <div className="flex flex-col gap-4">
      <SelectSensor
        sensors={sensors}
        changeSelectedSensor={(sensorId: string) => setSelectedSensor(sensorId)}
      />
      <DatePickerWithRange
        updateSelectedDays={(days) => {
          setSelectedDays(days);
        }}
      />
      <h2 className="text-center">{`Sensorin ${sensors.find((sensor) => sensor.sensorId === selectedSensor)?.sensorName} mittaushistoria`}</h2>
      <ChartComponent
        type="temperature"
        measurements={
          measurementsMap.get(selectedSensor)?.filter((measurement) => {
            if (!selectedDays) return true;
            return (
              measurement.timeStamp >= selectedDays.from &&
              measurement.timeStamp <= selectedDays.to
            );
          }) || []
        }
      />
      <ChartComponent
        type="humidity"
        measurements={
          measurementsMap.get(selectedSensor)?.filter((measurement) => {
            if (!selectedDays) return true;
            return (
              measurement.timeStamp >= selectedDays.from &&
              measurement.timeStamp <= selectedDays.to
            );
          }) || []
        }
      />
    </div>
  );
};
