import { EndpointResponse } from "types/api";


export const fetchEndpointCalls = async (timeRange: "24h" | "7d" | "30d"): Promise<EndpointResponse> => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL;
    const url = `${baseUrl}/endpoints?range=${timeRange}`;


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
    return data;
  } catch (error) {
    console.error("Error fetching endpoint data:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch endpoint data");
  }
};