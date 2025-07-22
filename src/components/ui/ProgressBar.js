'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  size = 'medium',
  variant = 'primary',
  showLabel = false,
  label,
  className 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    small: "h-1",
    medium: "h-2",
    large: "h-3"
  };
  
  const variants = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error"
  };

  return (
    <div className={clsx("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-on-surface">
            {label || `${Math.round(percentage)}%`}
          </span>
          <span className="text-sm text-on-surface-variant">
            {value}/{max}
          </span>
        </div>
      )}
      
      <div className={clsx(
        "w-full bg-surface-variant rounded-full overflow-hidden",
        sizes[size]
      )}>
        <motion.div
          className={clsx("h-full rounded-full", variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.5, 
            ease: [0.4, 0, 0.2, 1]
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
