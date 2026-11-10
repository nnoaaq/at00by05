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
  measurementsData,
}: {
  measurementsData: MeasurementType[];
}) => {
  // TÄNNE SAAVUTAAN VASTA KUN DATAA ON TULLUT: 404-SIVULLE UUDELLEENOHJAUS JO AIEMMIN

  // NÄYTETTÄVÄ DATA
  // [{measurement:MeasurementType]
  const data = measurementsData.map((measurement) => {
    return {
      measurement: measurement,
    };
  });

  const chartData = {
    labels: data.map((measurement) =>
      convertTime(measurement.measurement.timeStamp),
    ),
    datasets: [
      {
        label: "Lämpötila",
        data: data.map((measurement) => measurement.measurement.temperature),
        fill: false,
        borderColor: "rgb(16, 60, 141)",
        backgroundColor: "rgb(159, 177, 209)",
        tension: 0.1,
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
