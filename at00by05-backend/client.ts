import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const dynamoDbClient = new DynamoDBClient({}); // LUODAAN UUSI DYNAMODBCLIENT
export const documentClient = DynamoDBDocumentClient.from(dynamoDbClient); // EXPORTATAAN DOCUMENTCLIENT
