import { ApiCall } from "../types/api";

export const fetchTableData = async (): Promise<ApiCall[]> => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL  
    const url = `${baseUrl}/traces`;

    const response = await fetch(url, {
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

    return mappedApiCalls;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to fetch trace data");
  }
};