"use server";

const { databaseUrl } = process.env;

export const getMeasurements = async () => {
  // HAETAAN KAIKKI MITTAUSTULOKSET TIETOKANNASTA
  // PALAUTTAA AINA VÄHINTÄÄN TYHJÄN TAULUKON []
  try {
    if (!databaseUrl) {
      throw new Error();
    }
    const output = await fetch(`${databaseUrl}/measurements`);
    if (output.ok) return await output.json();
    return []; // PYYNTÖ EPÄONNISTUNUT
  } catch (error) {
    return [];
  }
};
