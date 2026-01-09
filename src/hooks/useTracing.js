import { useCallback } from "react";
import { trackInteraction, traceAsync, getTracer } from "../utils/tracing";

/**
 * Custom hook for tracing user interactions and operations
 */
export function useTracing() {
  const trackClick = useCallback((elementName, attributes = {}) => {
    trackInteraction("click", elementName, attributes);
  }, []);

  const trackNavigation = useCallback((destination, attributes = {}) => {
    trackInteraction("navigation", destination, {
      "navigation.destination": destination,
      ...attributes,
    });
  }, []);

  const trackFormSubmit = useCallback((formName, attributes = {}) => {
    trackInteraction("form_submit", formName, attributes);
  }, []);

  const trackScroll = useCallback((section, attributes = {}) => {
    trackInteraction("scroll", section, {
      "scroll.section": section,
      ...attributes,
    });
  }, []);

  const traceOperation = useCallback(async (name, fn, attributes = {}) => {
    return traceAsync(name, fn, attributes);
  }, []);

  return {
    trackClick,
    trackNavigation,
    trackFormSubmit,
    trackScroll,
    traceOperation,
    getTracer,
  };
}

export default useTracing;
