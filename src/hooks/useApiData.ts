// src/hooks/useApiData.ts
import { useState, useEffect } from "react";
import { ApiCall, ApiStats, ChartData } from "../types/api";
import { fetchTableData } from "../services/traceTableService";
import { ApiUsageData, generateApiUsageData } from "../services/apiUsageService";

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
      const [usageData, setUsageData] = useState<ApiUsageData[]>([]); // New state for usage data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTableData();
        console.log("useApiData - Fetched Data:", data); // Pour débogage
        setApiCalls(data);

        const totalRequests = data.length;
        const successfulRequests = data.filter(call => call.status >= 200 && call.status < 300).length;
        const clientErrors = data.filter(call => call.status >= 400 && call.status < 500).length;
        const serverErrors = data.filter(call => call.status >= 500).length;
        const errorRequests = totalRequests - successfulRequests;
        const averageResponseTime = data.reduce((sum, call) => sum + call.responseTime, 0) / totalRequests || 0;

        // Calculate usage data with percentages
        const usage = generateApiUsageData(data);

        setStats({
          totalRequests,
          successfulRequests,
          errorRequests,
          clientErrors,
          serverErrors,
          averageResponseTime,
          requestsPerSecond: 0,
          activeConnections: 0,
          availability: (successfulRequests / totalRequests) * 100 || 99.9,
          p95ResponseTime: 200,
          throughput: 600,
        });

        setChartData({
          requestsPerMinute: Array(totalRequests).fill(0).map((_, i) => i + 1),
          responseTime: data.map(call => call.responseTime),
          errorRate: Array(totalRequests).fill(0).map((_, i) => i % 5 === 0 ? 1 : 0),
        });

        setUsageData(usage); // Store enriched usage data
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch API data");
        console.error("Fetch error:", err);
        setIsLoading(false);
      }
    };

    fetchData(); // Appel unique au montage
  }, []); // Tableau de dépendances vide pour un effet unique

  return { apiCalls, stats, chartData, usageData, isLoading, error }; // Ajout de usageData au retour
};