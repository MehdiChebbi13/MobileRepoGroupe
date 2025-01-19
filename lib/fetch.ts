import { useState, useEffect, useCallback } from "react";

export const fetchAPI = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
      });
  
      if (!response.ok) {
        const errorBody = await response.text(); // Capture error body for debugging
        throw new Error(
          `HTTP error! Status: ${response.status} - ${response.statusText}. Body: ${errorBody}`
        );
      }
  
      // Ensure response is JSON before parsing
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        throw new Error("Invalid JSON response");
      }
    } catch (error: any) {
      console.error("Fetch error:", error.message || error);
      throw new Error(error.message || "An unknown error occurred during fetch");
    }
  };
  
  
  
  export const useFetch = <T>(
    url: string,
    options?: RequestInit,
    autoFetch: boolean = true
  ) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);
  
      try {
        console.log(`Fetching data from: ${url}`);
        const result = await fetchAPI(url, options);
        console.log("Fetch result:", result); // Log fetched data
        setData(result); // No assumption about `result.data`
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }, [url, options]);
  
    useEffect(() => {
      if (autoFetch) {
        fetchData();
      }
    }, [fetchData, autoFetch]);
  
    return { data, loading, error, refetch: fetchData };
  };
