import { Elysia, t } from "elysia";
import { ApiResponse, DeviceRequest } from "../interfaces";
import { auth } from "../auth.middleware";
import { env } from "bun";

// Define the device time schema separately for better readability
const deviceTimeSchema = t.Object({
  endDate: t.String(),
  endTime: t.String(),
  peopleLimit: t.Optional(t.Number()),
  startDate: t.String(),
  startTime: t.String(),
  status: t.String()
});

// Define the request body schema separately
const deviceRequestSchema = t.Object({
  changeLabel: t.Union([t.Literal("New"), t.Literal("Modify"), t.Literal("Cancel")]),
  resourceCode: t.String(),
  changeTime: t.Optional(t.String()),
  deviceTimeList: t.Optional(t.Array(deviceTimeSchema)),
  deviceType: t.Optional(t.String()),
  facilityAddress: t.Optional(t.String()),
  facilityName: t.Optional(t.String()),
  fleet: t.Optional(t.String()),
  port: t.Optional(t.String()),
  publishStatus: t.Optional(t.Number()),
  resourceType: t.Optional(t.String()),
  roomCapacity: t.Optional(t.String()),
  simId: t.Optional(t.String()),
  slotCode: t.Optional(t.String()),
  telephone: t.Optional(t.String())
});

// Handler function for device updates
const handleDeviceUpdate = async ({ jwt, error, headers, body }: any): Promise<ApiResponse> => {
  const token = headers[env.HEADER_KEY_AUTHORIZATION || 'access-token'];

  if (!token) {
    throw error(401, 'Missing access token');
  }

  const profile = await jwt.verify(token);
  if (!profile) {
    throw error(401);
  }

  // Mock random success or failure
  const isSuccess = Math.random() > 0.2; // 80% chance of success
  if (!isSuccess) {
    return {
      code: 500,
      message: "Internal Server Error: Mock failure"
    };
  }

  console.log("Received device update:", JSON.stringify(body, null, 2));

  // Return success response
  return {
    code: 0,
    message: "success"
  };
};

// Error handler function
const handleErrors = ({ code, error, set }: any) => {
  switch (code) {
    case 'VALIDATION':
      set.status = 400;
      return {
        code: 400,
        message: 'Validation error',
        status: 'error',
      };
    case 'NOT_FOUND':
      set.status = 404;
      return {
        status: 'error',
        message: error.toString(),
      };
    case 401:
      set.status = 401;
      return {
        code: 401,
        status: 'error',
        message: 'Invalid access token',
      };
    case 'INTERNAL_SERVER_ERROR':
      set.status = 500;
      return {
        status: 'error',
        message: 'Something went wrong!',
      };
  }
};

// Export the controller with all components assembled
export const deviceController = new Elysia()
  .use(auth)
  .post(
    "/in/tm/device",
    handleDeviceUpdate,
    { body: deviceRequestSchema }
  )
  .onError(handleErrors);