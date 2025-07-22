'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import clsx from 'clsx';

const Button = forwardRef(({ 
  children, 
  variant = 'filled', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  icon,
  className,
  onClick,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full";
  
  const variants = {
    filled: "bg-primary text-on-primary hover:bg-primary/90 focus:ring-primary/50 elevation-1 hover:elevation-2",
    outlined: "border border-outline text-primary hover:bg-primary/5 focus:ring-primary/50",
    text: "text-primary hover:bg-primary/5 focus:ring-primary/50",
    tonal: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 focus:ring-secondary/50"
  };
  
  const sizes = {
    small: "h-8 px-3 text-sm gap-1",
    medium: "h-10 px-4 text-sm gap-2", 
    large: "h-12 px-6 text-base gap-2"
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  return (
    <motion.button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
