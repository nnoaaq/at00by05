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
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export const ChartComponent = ({
  type,
  measurements,
}: {
  type: "temperature" | "humidity";

  measurements: MeasurementType[];
}) => {
  const isTemperatureChart = type === "temperature";

  const chartData = {
    labels: measurements.map((measurement) =>
      convertTime(measurement.timeStamp),
    ),
    datasets: [
      {
        label: isTemperatureChart ? "Lämpötila" : "Kosteus",
        data: measurements.map((measurement) => measurement[type]),
        fill: false,
        borderColor: isTemperatureChart ? "#7ccf00" : "#2837bb",
        backgroundColor: isTemperatureChart ? "#7ccf00" : "#2837bb",
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
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};
