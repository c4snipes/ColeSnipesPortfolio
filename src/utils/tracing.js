// Simplified tracing stub - OpenTelemetry removed for simpler deployment
// These functions are no-ops that maintain the API surface

export function initTracing() {
  // No-op
  return null
}

export function getTracer() {
  return null
}

export function trackPageView(pageName, attributes = {}) {
  // Silent no-op for page tracking
}

export function trackInteraction(interactionType, elementName, attributes = {}) {
  // Silent no-op for interaction tracking
}

export async function traceAsync(name, fn, attributes = {}) {
  // Just execute the function without tracing
  return await fn()
}

export async function shutdownTracing() {
  // No-op
}
