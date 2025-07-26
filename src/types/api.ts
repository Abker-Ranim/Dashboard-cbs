// ../types/api.ts
export interface ApiCall {
  id: string;
  timestamp: Date; // Mappé depuis startTime ou endTime
  method: string;  // Mappé depuis httpMethod
  endpoint: string; // Mappé depuis httpUrl
  status: number;  // Mappé depuis status ou httpStatusCode converti
  responseTime: number; // Mappé depuis durationMs
  name?: string;
}
  export interface ApiStats {
    totalRequests: number;
    successfulRequests: number;
    errorRequests: number;
    clientErrors: number;
    serverErrors: number;
    averageResponseTime: number;
    requestsPerSecond: number;
    activeConnections: number;
    availability?: number;
    p95ResponseTime?: number;
    throughput?: number;
  }
  
  export interface ChartData {
    requestsPerMinute: number[];
    responseTime: number[];
    errorRate: number[];
  }
  export interface EvolutionDataPoint {
    time: string;
    success: number;
    errors: number;
    total: number;
  }
  export interface EvolutionResponse {
    data: EvolutionDataPoint[];
    status: number;
  }