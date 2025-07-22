'use client';

import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`${sizes[size]} border-2 border-primary border-t-transparent rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" className="mx-auto mb-4" />
        <p className="text-on-surface-variant">{message}</p>
      </div>
    </div>
  );
};

export { LoadingSpinner, LoadingScreen };
export default LoadingSpinner;
