/**
 * ErrorBoundary.jsx
 *
 * Class component wrapping the full app to catch unhandled render errors.
 * React requires a class component for error boundaries — hooks cannot
 * implement getDerivedStateFromError or componentDidCatch.
 *
 * On error:
 * - Replaces the crashed UI with a recovery screen
 * - Logs the error and component stack to console for debugging
 * - Offers two recovery paths: soft reset (re-render) or hard reload
 * - Exposes technical details in a collapsed <details> block for developers
 *
 * "Try again" resets local state, which triggers a re-render of children.
 * This only works if the underlying error was transient (e.g. a failed fetch).
 * For persistent errors (bad data, broken imports), "Refresh page" is the
 * appropriate path.
 */

import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null }

  /**
   * Updates state to trigger the error UI on the next render.
   * Runs during the render phase — must be a pure static method.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  /**
   * Runs after render — safe to log or call side effects here.
   * Captures the React component stack for the technical details panel.
   */
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  /** Clears error state, allowing React to attempt re-rendering children. */
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      const errorMessage    = this.state.error?.message || 'Unexpected application error.'
      const componentStack  = this.state.errorInfo?.componentStack

      return (
        <div className="error-boundary">
          <p className="error-boundary__title">Something went wrong.</p>
          <p className="error-boundary__message">
            {errorMessage} You can retry, or refresh the page.
          </p>
          <div className="error-boundary__actions">
            <button
              onClick={this.handleReset}
              className="error-boundary__button"
              type="button"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="error-boundary__button error-boundary__button--ghost"
              type="button"
            >
              Refresh page
            </button>
          </div>

          {/* Technical details — collapsed by default, visible to developers */}
          {(this.state.error || componentStack) && (
            <details className="error-boundary__details">
              <summary className="error-boundary__summary">Technical details</summary>
              <pre className="error-boundary__stack">
                {this.state.error?.toString()}
                {componentStack ? `\n${componentStack}` : ''}
              </pre>
            </details>
          )}
        </div>
      )
    }

    // No error — render children normally
    return this.props.children
  }
}

export default ErrorBoundary
