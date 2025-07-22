'use client';

import { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';
import Card from './Card';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to analytics service
    console.error('Quiz App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card elevation={3} className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="mb-6"
              >
                <div className="w-16 h-16 mx-auto bg-error-container rounded-full flex items-center justify-center">
                  <AlertTriangle size={32} className="text-on-error-container" />
                </div>
              </motion.div>

              <h1 className="text-2xl font-bold text-on-surface mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-on-surface-variant mb-6">
                Terjadi kesalahan yang tidak terduga. Silakan refresh halaman atau coba lagi nanti.
              </p>

              {process.env.NODE_ENV === 'development' && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-on-surface-variant mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs bg-surface-variant p-2 rounded overflow-auto">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="space-y-3">
                <Button
                  variant="filled"
                  size="large"
                  onClick={() => window.location.reload()}
                  icon={<RefreshCw size={18} />}
                  className="w-full"
                >
                  Refresh Halaman
                </Button>
                
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full"
                >
                  Coba Lagi
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
