import { documentClient as dynamoDb } from "./client"; // LUOTU DOCUMENTCLIENT
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"; // HTTP-PYYNTÖJEN TYYPIT
const authorizationCode = process.env.authorizationCode; // .ENV-TIEDOSTOSTA
const measurementsTableName = process.env.measurementsTableName;
import * as z from "zod"; // VALIDOINTI-KIRJASTO
import { CustomError, handleError } from "./error";
import {
  BatchWriteCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
export const saveMeasurements = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!authorizationCode || !measurementsTableName)
      throw new CustomError(400, {
        message: "Virhe ympäristömuuttujien kanssa.",
      });
    if (
      !event.headers.authorization ||
      event.headers.authorization !== authorizationCode
    )
      throw new CustomError(404, {
        message: "Luvaton käyttö havaittu.",
      });
    // PYYNTÖ VARMENNETTU
    const RequiredMeasurementFields = z.object({
      sensorId: z.string(),
      sensorName: z.string(),
      temperature: z.number().optional(),
      humidity: z.number().optional(),
      timeStamp: z.number(),
    });
    const body = JSON.parse(event.body as string);
    if (Array.isArray(body)) {
      // LÄHETETTY [] TAULUKKO
      const RequiredArrayJSONObjects = z.array(RequiredMeasurementFields);
      const measurements = RequiredArrayJSONObjects.parse(body);
      // KENTÄT VARMENNETTU

      if (measurements.length > 25) {
        // AWS BATCHWRITE KESTÄÄ VAIN 25 KERRALLA
        for (let i = 0; i < measurements.length; i += 25) {
          const smallBatch = measurements.slice(i, i + 25);

          const putRequests = smallBatch.map((item) => ({
            PutRequest: {
              Item: item,
            },
          }));
          console.log("ok:", putRequests);
          await dynamoDb.send(
            new BatchWriteCommand({
              RequestItems: {
                [measurementsTableName]: putRequests,
              },
            }),
          );
        }
      } else {
        const putRequests = measurements.map((item) => ({
          PutRequest: {
            Item: item,
          },
        }));
        await dynamoDb.send(
          new BatchWriteCommand({
            RequestItems: {
              [measurementsTableName]: putRequests,
            },
          }),
        );
      }
      return {
        headers: {
          "content-type": "application/json",
        },
        statusCode: 201,
        body: JSON.stringify({
          measurements,
        }),
      };
    } else {
      const measurement = RequiredMeasurementFields.parse(body);
      // KENTÄT VARMENNETTU
      await dynamoDb.send(
        new PutCommand({
          TableName: measurementsTableName,
          Item: measurement,
          // Item: { ...measurement, timeStamp: Math.floor(Date.now() / 1000) },
        }),
      );
      return {
        headers: {
          "content-type": "application/json",
        },
        statusCode: 201,
        body: JSON.stringify({
          measurement,
        }),
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // KERÄTÄÄN VIRHEELLISET KENTÄT
      let faultyFields = error.issues.map((issue) => issue.path);
      return handleError(
        new CustomError(400, {
          message: `Tarkista kentät: ${faultyFields}`,
        }),
      );
    }
    return handleError(error);
  }
};
export const getMeasurements = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!measurementsTableName)
      throw new CustomError(400, {
        message: "Virhe ympäristömuuttujien kanssa.",
      });
    const output = await dynamoDb.send(
      new ScanCommand({
        TableName: measurementsTableName,
      }),
    );
    return {
      headers: {
        "content-type": "application/json",
      },
      statusCode: 200,
      body: JSON.stringify(output.Items),
    };
  } catch (error) {
    return handleError(error);
  }
};
export const saveMeasurement = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!measurementsTableName || !authorizationCode) {
      throw new CustomError(400, {
        message: "Virhe ympäristömuuttujien kanssa.",
      });
    }
    const { headers, body } = event; // POIMITAAN KENTÄT EVENTISTÄ
    if (!headers.authorization || headers.authorization !== authorizationCode) {
      throw new CustomError(401, {
        message: "Luvaton käyttö havaittu.",
      });
    }
    // YKSITTÄISEN MITTAUSTULOKSEN KENTÄT
    const MeasurementZod = z.object({
      sensorId: z.string(),
      sensorName: z.string(),
      temperature: z.number().optional(),
      humidity: z.number().optional(),
      timeStamp: z.number(),
    });
    const MeasurementArrayZod = z
      .union([MeasurementZod, z.array(MeasurementZod)])
      .transform((value) => (Array.isArray(value) ? value : [value])); // AINA TAULUKKO TÄSTÄ LÄHTIEN
    const parsedBody = JSON.parse(body as string);
    const measurements = MeasurementArrayZod.parse(parsedBody);
    let savedMeasurements = 0;
    // KÄYDÄÄN LÄPI MEASUREMENTS 25 - LOHKOISSA (AWS BATCHWRITEN MAX)
    for (let i = 0; i < measurements.length; i += 25) {
      const batch = measurements.slice(i, i + 25);
      const putRequests = batch.map((measurement) => ({
        PutRequest: {
          Item: measurement,
        },
      }));
      await dynamoDb.send(
        new BatchWriteCommand({
          RequestItems: {
            [measurementsTableName]: putRequests,
          },
        }),
      );
      savedMeasurements += batch.length;
    }
    return {
      statusCode: 201,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ savedMeasurements: savedMeasurements }),
    };
  } catch (error) {
    return handleError(error);
  }
};
