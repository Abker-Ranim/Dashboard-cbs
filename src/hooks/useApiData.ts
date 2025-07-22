// src/hooks/useApiData.ts
import { useState, useEffect } from "react";
import { ApiCall, ApiStats, ChartData } from "../types/api";

export const useApiData = () => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [stats, setStats] = useState<ApiStats>({
    totalRequests: 0,
    successfulRequests: 0,
    errorRequests: 0,
    clientErrors: 0,
    serverErrors: 0,
    averageResponseTime: 0,
    requestsPerSecond: 0,
    activeConnections: 0,
    availability: 99.9,
    p95ResponseTime: 200,
    throughput: 600,
  });
  const [chartData, setChartData] = useState<ChartData>({
    requestsPerMinute: [],
    responseTime: [],
    errorRate: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const mockApiCalls: ApiCall[] = [
          {
            id: "1",
            timestamp: new Date(),
            method: "GET",
            endpoint: "/api/users",
            status: 200,
            responseTime: 120,
            service: "UserService",
            userAgent: "Mozilla/5.0",
            ip: "192.168.1.1",
          },
        ];
        const mockStats: ApiStats = {
          totalRequests: 1000,
          successfulRequests: 950,
          errorRequests: 50,
          clientErrors: 30,
          serverErrors: 20,
          averageResponseTime: 150,
          requestsPerSecond: 10,
          activeConnections: 25,
          availability: 99.8,
          p95ResponseTime: 200,
          throughput: 600,
        };
        const mockChartData: ChartData = {
          requestsPerMinute: [50, 60, 55, 70, 65, 80],
          responseTime: [120, 130, 110, 140, 125, 135],
          errorRate: [2, 3, 1, 4, 2, 3],
        };

        setApiCalls(mockApiCalls);
        setStats(mockStats);
        setChartData(mockChartData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch API data");
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { apiCalls, stats, chartData, isLoading, error };
}