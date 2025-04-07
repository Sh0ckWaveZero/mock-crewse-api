# Mock Crewse API

A mock API service built with Bun and Elysia.js that simulates device management endpoints.

## Features

- Device management endpoint (`/in/tm/device`)
- JWT-based authentication
- Request validation
- Configurable success/failure simulation (80% success rate)
- Environment variable configuration

## Prerequisites

- [Bun](https://bun.sh/) runtime installed
- Node.js 14.x or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mock-crewse-api
```

2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file in the root directory with the following variables:
```env
JWT_SECRET=your-secret-key
HEADER_KEY_AUTHORIZATION=access-token
```

## Development

To start the development server with hot reload:

```bash
bun run dev
```

The server will start at http://localhost:6032

## API Documentation

### Device Management Endpoint

**POST** `/in/tm/device`

Updates device information and manages device time slots.

#### Headers
- `access-token`: JWT authentication token (required)

#### Request Body
```json
{
  "changeLabel": "New" | "Modify" | "Cancel",
  "resourceCode": "string",
  "changeTime": "string" (optional),
  "deviceTimeList": [
    {
      "endDate": "string",
      "endTime": "string",
      "peopleLimit": number,
      "startDate": "string",
      "startTime": "string",
      "status": "string"
    }
  ] (optional),
  "deviceType": "string" (optional),
  "facilityAddress": "string" (optional),
  "facilityName": "string" (optional),
  "fleet": "string" (optional),
  "port": "string" (optional),
  "publishStatus": number (optional),
  "resourceType": "string" (optional),
  "roomCapacity": "string" (optional),
  "simId": "string" (optional),
  "slotCode": "string" (optional),
  "telephone": "string" (optional)
}
```

#### Response
Success (200):
```json
{
  "code": 0,
  "message": "success"
}
```

Error (400, 401, 500):
```json
{
  "code": number,
  "message": "string",
  "status": "error"
}
```

## Authentication

To generate an authentication token, use:

```bash
bun run token
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Internal server errors (500)

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under a Non-Commercial Use License - see the [LICENSE](LICENSE) file for details.

**Important**: This software cannot be used for commercial purposes. Commercial use is strictly prohibited without explicit written permission from the copyright holder.