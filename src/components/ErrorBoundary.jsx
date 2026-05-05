import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'Unexpected application error.'
      const componentStack = this.state.errorInfo?.componentStack
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
    return this.props.children
  }
}

export default ErrorBoundary
