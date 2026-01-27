import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h1>😕 Something went wrong</h1>
          <p>We’re fixing it. Please try again.</p>
          <Link to="/">Go Home</Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
