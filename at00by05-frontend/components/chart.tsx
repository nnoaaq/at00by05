"use client";
import { MeasurementType } from "@/types/measurement";
import { convertTime } from "@/utils/timestamp";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { SelectSensor } from "./SelectSensor";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export const ChartComponent = ({
  measurementsData,
}: {
  measurementsData: MeasurementType[];
}) => {
  // TÄNNE SAAVUTAAN VASTA KUN DATAA ON TULLUT: 404-SIVULLE UUDELLEENOHJAUS JO AIEMMIN
  console.log("vastaanotettu data:", measurementsData);

  // RYHMITELLÄÄN MITTAUSTULOKSET
  // sensorId : MeasurementType[] MAPPI
  const measurements = new Map<string, MeasurementType[]>();
  for (const measurement of measurementsData) {
    const measurementsArray = measurements.get(measurement.sensorId) ?? []; // AINA TAULUKKO
    measurementsArray.push(measurement);
    measurements.set(measurement.sensorId, measurementsArray);
  }
  // MEASUREMENTS-MAPPI ON NYT LAJITELTU INITIAL-DATALLA
  // POIMITAAN MAPIN AVAIMET ELI SENSORIT OMAAN MAPPIIN
  const sensors = Array.from(measurements.entries()).map(
    ([sensorId, sensorMeasurements]) => ({
      sensorId: sensorId,
      sensorName: sensorMeasurements[0]?.sensorName ?? "",
    }),
  );
  console.log("sensors:", sensors);
  // VALITUN SENSORIN STATE
  const [selectedSensor, setSelectedSensor] = useState(sensors[0].sensorId);
  // NÄYTETTÄVÄ DATA
  // [{measurement:MeasurementType]
  const data = measurements.get(selectedSensor) || [];
  console.log("data:", data);
  const chartData = {
    labels: data.map((measurement) => convertTime(measurement.timeStamp)),
    datasets: [
      {
        label: "Lämpötila",
        data: data.map((measurement) => measurement.temperature),
        fill: false,
        borderColor: "#7ccf00",
        backgroundColor: "#4c750d",
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHitRadius: 25,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 5,
          font: {
            size: 10,
          },
        },
      },
    },
  };
  return (
    <div className="w-full h-100">
      <SelectSensor
        sensors={sensors}
        changeSelectedSensor={(sensorId: string) => setSelectedSensor(sensorId)}
      />
      <div className="w-full h-80 flex flex-col items-center">
        <h2>{`Sensorin ${sensors.find((sensor) => sensor.sensorId === selectedSensor)?.sensorName} mittaushistoria`}</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
