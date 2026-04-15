export const normalizeAnalyticsLabel = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_:/#.-]/g, "");

export const trackPortfolioEvent = (action, label) => {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", action, {
    event_category: "portfolio_engagement",
    event_label: normalizeAnalyticsLabel(label),
  });
};
