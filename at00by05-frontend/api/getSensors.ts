"use server";
const { databaseUrl } = process.env;

// FUNKTIO JOKA HAKEE SENSORIT TIETOKANNASTA
// PALAUTTAA AINA TAULUKON
export const getSensors = async () => {
  try {
    if (!databaseUrl) throw new Error();
    const output = await fetch(`${databaseUrl}/sensors`, {
      cache: "no-cache",
    });
    if (output.ok) return await output.json();
    return [];
  } catch (error) {
    return [];
  }
};
