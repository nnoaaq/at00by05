import { documentClient as dynamoDb } from "./client"; // LUOTU DOCUMENTCLIENT
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"; // HTTP-PYYNTÖJEN TYYPIT
const sensorsTableName = process.env.sensorsTableName;
import { CustomError, handleError } from "./error";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
export const getSensors = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!sensorsTableName) {
      throw new CustomError(400, {
        message: "Virhe ympäristömuuttujien kanssa.",
      });
    }

    const sensors = await dynamoDb.send(
      new ScanCommand({
        TableName: sensorsTableName,
      }),
    );
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(sensors.Items),
    };
  } catch (error) {
    return handleError(error);
  }
};
