// Device Time interface
export interface DeviceTime {
  endDate: string;     // YYYY-MM-DD (UTC Time)
  endTime: string;     // HH:mm (UTC Time)
  peopleLimit?: number;
  startDate: string;   // YYYY-MM-DD (UTC Time)
  startTime: string;   // HH:mm (UTC Time)
  status: string;      // "Y – available, N - unavailable"
}

// Main device request interface
export interface DeviceRequest {
  changeLabel: string;        // New, Modify, Cancel
  changeTime?: string;        // yyyy/MM/dd HH:mm:ss
  deviceTimeList?: DeviceTime[];
  deviceType?: string;        // S-SIM, C-Classroom, F-Flight, E-eLearning
  facilityAddress?: string;
  facilityName?: string;      // description
  fleet?: string;
  port?: string;              // airport
  publishStatus?: number;     // 1: available, 0: unavailable
  resourceCode: string;       // Required
  resourceType?: string;      // Device group
  roomCapacity?: string;      // Max capacity
  simId?: string;
  slotCode?: string;
  telephone?: string;
}

// Response interface
export interface ApiResponse {
  code: number;
  message: string;
}

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}