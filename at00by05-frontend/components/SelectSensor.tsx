import { SensorsType } from "@/types/sensors";

export const SelectSensor = ({
  sensors,
  changeSelectedSensor,
}: {
  sensors: SensorsType[];
  changeSelectedSensor: (sensorId: string) => void;
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="selectedSensor"
        className="block translate-y-2 translate-x-2 bg-zinc-800 w-fit text-lime-500 uppercase text-xs"
      >
        Valitse sensori
      </label>
      <select
        onChange={(e) => changeSelectedSensor(e.target.value)}
        className="border border-zinc-600 p-2 rounded-xl rounded-tl-none outline-none hover:ring-1 hover:ring-lime-500 focus:ring-1 focus:ring-lime-500 transition-all duration-100 ease-in-out"
        name="selectedSensor"
        id="selectedSensor"
      >
        {sensors &&
          sensors.map((sensor) => (
            <option key={sensor.sensorId} value={sensor.sensorId}>
              {`${sensor.sensorName} - #${sensor.sensorId}`}
            </option>
          ))}
      </select>
    </div>
  );
};
