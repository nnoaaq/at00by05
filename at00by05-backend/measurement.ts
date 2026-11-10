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
export const saveMeasurement = async (
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
      temperature: z.number(),
      humidity: z.number(),
      timeStamp: z.number(),
    });
    const body = JSON.parse(event.body as string);
    if (Array.isArray(body)) {
      // LÄHETETTY [] TAULUKKO
      const RequiredArrayJSONObjects = z.array(RequiredMeasurementFields);
      const measurements = RequiredArrayJSONObjects.parse(body);
      // KENTÄT VARMENNETTU
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
