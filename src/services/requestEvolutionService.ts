// src/services/requestEvolutionService.ts
import { EvolutionResponse } from "../types/api";

export const fetchEvolutionData = async (timeRange: "24h" | "7d" | "30d"): Promise<EvolutionResponse> => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8090";
    const url = `${baseUrl}/api/evolution?range=${timeRange}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EvolutionResponse = await response.json();
    console.log("Fetched data:", data); // Pour débogage
    return data;
  } catch (error) {
    console.error("Error fetching evolution data:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch evolution data");
  }
};