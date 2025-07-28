// src/services/endpointCallService.ts
export interface EndpointData {
  total: number;
  name: string;
}

export interface EndpointResponse {
  data: EndpointData[];
  status: number;
}

export const fetchEndpointCalls = async (timeRange: "24h" | "7d" | "30d"): Promise<EndpointResponse> => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8090";
    const url = `${baseUrl}/api/endpoints?range=${timeRange}`;

    console.log("Fetching endpoint data from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response status:", response.status, "Response text:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EndpointResponse = await response.json();
    console.log("Fetched endpoint data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching endpoint data:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch endpoint data");
  }
};