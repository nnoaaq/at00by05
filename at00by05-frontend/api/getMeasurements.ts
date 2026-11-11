"use server";

const { databaseUrl } = process.env;

export const getMeasurements = async () => {
  // HAETAAN KAIKKI MITTAUSTULOKSET TIETOKANNASTA
  // PALAUTTAA AINA VÄHINTÄÄN TYHJÄN TAULUKON []
  try {
    if (!databaseUrl) {
      throw new Error();
    }
    const output = await fetch(`${databaseUrl}/measurements`, {
      cache: "no-cache",
    });
    if (output.ok) return await output.json();
    return []; // PYYNTÖ EPÄONNISTUNUT
  } catch (error) {
    return [];
  }
};
export const getMeasurementsFromDays = async (
  from: number,
  to: number,
  sensorId: string,
) => {
  try {
    if (!databaseUrl) throw new Error();
    if (!from || !to || !sensorId) return [];
    const output = await fetch(
      `${databaseUrl}/measurements/range?from=${from}&to=${to}&sensorId=${sensorId}`,
    );
    if (output.ok) return await output.json();
    return [];
  } catch (error) {
    return [];
  }
};
