import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { trace, context } from "@opentelemetry/api";

// Configuration
const OTLP_ENDPOINT = "http://localhost:4318/v1/traces";
const SERVICE_NAME = "cole-snipes-portfolio";
const SERVICE_VERSION = "1.0.0";

let tracerProvider = null;
let tracer = null;

/**
 * Initialize OpenTelemetry tracing for the browser
 */
export function initTracing() {
  // Create resource with service information
  const resource = new Resource({
    [ATTR_SERVICE_NAME]: SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: SERVICE_VERSION,
  });

  // Create OTLP exporter
  const exporter = new OTLPTraceExporter({
    url: OTLP_ENDPOINT,
  });

  // Create tracer provider
  tracerProvider = new WebTracerProvider({
    resource,
  });

  // Add batch span processor with OTLP exporter
  tracerProvider.addSpanProcessor(new BatchSpanProcessor(exporter));

  // Register the provider with zone context manager for async context propagation
  tracerProvider.register({
    contextManager: new ZoneContextManager(),
  });

  // Register auto-instrumentations
  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [/api\.github\.com/, /localhost/],
        clearTimingResources: true,
      }),
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [/api\.github\.com/, /localhost/],
      }),
    ],
  });

  // Get tracer instance
  tracer = trace.getTracer(SERVICE_NAME, SERVICE_VERSION);

  console.log("[Tracing] OpenTelemetry initialized");

  return tracer;
}

/**
 * Get the tracer instance
 */
export function getTracer() {
  if (!tracer) {
    return initTracing();
  }
  return tracer;
}

/**
 * Create a span for tracking page navigation
 */
export function trackPageView(pageName, attributes = {}) {
  const currentTracer = getTracer();
  const span = currentTracer.startSpan(`page_view: ${pageName}`, {
    attributes: {
      "page.name": pageName,
      "page.url": window.location.href,
      "page.path": window.location.pathname,
      ...attributes,
    },
  });

  // End the span immediately for page views
  span.end();

  return span;
}

/**
 * Create a span for tracking user interactions
 */
export function trackInteraction(
  interactionType,
  elementName,
  attributes = {}
) {
  const currentTracer = getTracer();
  const span = currentTracer.startSpan(`interaction: ${interactionType}`, {
    attributes: {
      "interaction.type": interactionType,
      "interaction.element": elementName,
      ...attributes,
    },
  });

  span.end();

  return span;
}

/**
 * Wrapper to trace async operations
 */
export async function traceAsync(name, fn, attributes = {}) {
  const currentTracer = getTracer();
  const span = currentTracer.startSpan(name, { attributes });

  try {
    const result = await context.with(
      trace.setSpan(context.active(), span),
      fn
    );
    span.setStatus({ code: 1 }); // OK
    return result;
  } catch (error) {
    span.setStatus({ code: 2, message: error.message }); // ERROR
    span.recordException(error);
    throw error;
  } finally {
    span.end();
  }
}

/**
 * Shutdown tracing (call on app unmount)
 */
export async function shutdownTracing() {
  if (tracerProvider) {
    await tracerProvider.shutdown();
    console.log("[Tracing] OpenTelemetry shutdown complete");
  }
}
