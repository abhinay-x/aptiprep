import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // eslint-disable-next-line no-console
    console.error('App render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong.</h1>
          <p style={{ marginBottom: 16 }}>An error occurred while rendering the app. See console for details.</p>
          {this.state.error && (
            <pre style={{ background: '#111827', color: '#e5e7eb', padding: 16, borderRadius: 8, overflow: 'auto' }}>
              {String(this.state.error)}
            </pre>
          )}
          {this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
