import React from "react";
import ApiSupervisionDashboard from "./components/ApiSupervisionDashboard";
import "./styles/globals.css";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container">
          <div className="error-message">
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message || "An unexpected error occurred"}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <div className="app-container">
        <ApiSupervisionDashboard />
      </div>
    </ErrorBoundary>
  );
}

export default App;