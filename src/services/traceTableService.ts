// src/services/traceTableService.ts
import { ApiCall } from "../types/api";

export const fetchTableData = async (): Promise<ApiCall[]> => {
  try {
    const response = await fetch("http://localhost:8090/api/traces", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const traceRecords: any[] = await response.json();

    if (!Array.isArray(traceRecords)) {
      throw new Error("Invalid data format: Expected an array");
    }

    const mappedApiCalls: ApiCall[] = traceRecords.map((record) => ({
      id: record.id || "N/A",
      timestamp: record.startTime ? new Date(record.startTime) : new Date(),
      method: record.httpMethod || "N/A",
      endpoint: record.httpUrl || "/",
      status: record.httpStatusCode !== undefined ? record.httpStatusCode : 0,
      responseTime: record.durationMs !== undefined ? record.durationMs : 0,
      name: record.name || "Unnamed Request",
    }));

    console.log("Fetched data:", mappedApiCalls); // Ajout pour débogage
    return mappedApiCalls;
  } catch (err) {
    console.error("Error in fetchTableData:", err);
    throw err instanceof Error ? err : new Error("Failed to fetch trace data");
  }
};