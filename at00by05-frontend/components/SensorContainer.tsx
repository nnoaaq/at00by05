"use client";

import { MeasurementType } from "@/types/measurement";
import { SensorsType } from "@/types/sensors";
import { useState } from "react";
import { SelectSensor } from "./SelectSensor";
import { ChartComponent } from "./Chart";

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
  return (
    <div className="flex flex-col gap-4">
      <SelectSensor
        sensors={sensors}
        changeSelectedSensor={(sensorId: string) => setSelectedSensor(sensorId)}
      />
      <h2 className="text-center">{`Sensorin ${sensors.find((sensor) => sensor.sensorId === selectedSensor)?.sensorName} mittaushistoria`}</h2>
      <ChartComponent
        type="temperature"
        measurements={measurements.get(selectedSensor) || []}
      />
      <ChartComponent
        type="humidity"
        measurements={measurements.get(selectedSensor) || []}
      />
    </div>
  );
};
