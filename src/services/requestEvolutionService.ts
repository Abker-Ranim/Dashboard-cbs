// src/services/requestEvolutionService.ts
import { EvolutionResponse } from "../types/api";

export const fetchEvolutionData = async (timeRange: "24h" | "7d" | "30d"): Promise<EvolutionResponse> => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL;
    const url = `${baseUrl}/evolution?range=${timeRange}`;

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
    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to fetch evolution data");
  }
};