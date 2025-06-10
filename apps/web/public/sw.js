self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", async () => {
  await self.registration.unregister();

  const cacheKeys = await caches.keys();
  const deleteResults = await Promise.all(
    cacheKeys.map(async (key) => {
      const success = await caches.delete(key);
      return { key, success };
    })
  );

  const deletedCount = deleteResults.filter((r) => r.success).length;

  // Send log to backend
  fetch("https://api.hey.xyz/echo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      deletedCount,
      deleteResults // array of { key, success }
    })
  }).catch(() => {});

  const clientsList = await clients.matchAll({ type: "window" });
  for (const client of clientsList) {
    client.navigate(client.url);
  }
});
