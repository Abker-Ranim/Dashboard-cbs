import { ApiCall, ApiUsageData } from "../types/api";

export const generateApiUsageData = (apiCalls: ApiCall[]): ApiUsageData[] => {
  if (!apiCalls || apiCalls.length === 0) return [];

  const apiCounts = apiCalls.reduce((acc, call) => {
    acc[call.name] = (acc[call.name] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const apiEntries = Object.entries(apiCounts);
  const totalCalls = apiEntries.reduce((sum, [, count]) => sum + count, 0);

  return apiEntries.map(([name, count]) => ({
    name,
    count,
    percentage: totalCalls > 0 ? (count / totalCalls) * 100 : 0,
    color: "#6B7280", // Couleur par défaut, ignorée si gérée dans Chart.tsx
  }));
};