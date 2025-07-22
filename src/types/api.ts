export interface ApiCall {
    id: string;
    timestamp: Date;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    endpoint: string;
    status: number;
    responseTime: number;
    service: string;
    userAgent: string;
    ip: string;
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