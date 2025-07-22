'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({ 
  children, 
  variant = 'filled', 
  elevation = 1,
  className,
  clickable = false,
  onClick,
  ...props 
}) => {
  const baseClasses = "rounded-3xl transition-all duration-300";
  
  const variants = {
    filled: "bg-surface-container text-on-surface",
    outlined: "border border-outline-variant bg-surface text-on-surface",
    elevated: "bg-surface-container-low text-on-surface"
  };
  
  const elevations = {
    0: "",
    1: "elevation-1",
    2: "elevation-2", 
    3: "elevation-3",
    4: "elevation-4",
    5: "elevation-5"
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    elevations[elevation],
    clickable && "cursor-pointer hover:elevation-3",
    className
  );

  const Component = clickable ? motion.div : 'div';
  const motionProps = clickable ? {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  } : {};

  return (
    <Component
      className={classes}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
