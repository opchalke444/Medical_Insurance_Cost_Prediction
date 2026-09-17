import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#fff1f2', color: '#9f1239', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Application Rendering Error</h1>
          <p style={{ marginTop: '1rem', fontWeight: '600' }}>{this.state.error?.toString()}</p>
          <pre style={{ marginTop: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '8px', overflow: 'auto', border: '1px solid #fecdd3' }}>
            {this.state.errorInfo?.componentStack || this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global error fallback
window.addEventListener('error', (e) => {
  console.error('Global window error:', e.error || e.message);
  const root = document.getElementById('root');
  if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
    root.innerHTML = `
      <div style="padding: 2rem; font-family: sans-serif; background: #fff1f2; color: #9f1239; min-height: 100vh;">
        <h1 style="font-size: 1.5rem; font-weight: bold;">Loading / Runtime Error</h1>
        <p style="margin-top: 1rem; font-weight: 600;">${e.message || 'Unknown error'}</p>
        <pre style="margin-top: 1rem; background: #ffffff; padding: 1rem; border-radius: 8px; overflow: auto; border: 1px solid #fecdd3;">
          ${e.filename || ''}:${e.lineno || ''}
        </pre>
      </div>
    `;
  }
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
