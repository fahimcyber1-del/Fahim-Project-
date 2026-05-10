export const runtimeStats = {
  requestCount: 0,
  activeSessions: new Set<string>(),

  // For requests/sec calculation
  lastRequestCount: 0,
  requestsPerSec: 0,
  lastCheckTime: Date.now()
};

// Calculate requests per second every second
setInterval(() => {
  const now = Date.now();
  const diff = now - runtimeStats.lastCheckTime;
  if (diff >= 1000) {
    const elapsedSecs = diff / 1000;
    runtimeStats.requestsPerSec = (runtimeStats.requestCount - runtimeStats.lastRequestCount) / elapsedSecs;
    runtimeStats.lastRequestCount = runtimeStats.requestCount;
    runtimeStats.lastCheckTime = now;
  }
}, 1000);
