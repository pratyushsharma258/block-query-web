export async function checkServerStatus(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8000/health", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status === "healthy" || data.status === "degraded";
  } catch (error) {
    console.error("Error checking server status:", error);
    return false;
  }
}
