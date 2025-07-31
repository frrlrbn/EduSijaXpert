'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, BarChart3, Clock, Target, TrendingUp, Award } from 'lucide-react';

const FloatingStats = ({ 
  questionsAnswered, 
  totalQuestions, 
  timeSpent, 
  currentStreak,
  averageTimePerQuestion 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completionRate = (questionsAnswered / totalQuestions) * 100;
  const avgTime = averageTimePerQuestion || (timeSpent / Math.max(questionsAnswered, 1));

  const quickStats = [
    {
      icon: <Target size={14} />,
      value: `${questionsAnswered}/${totalQuestions}`,
      label: 'Progress'
    },
    {
      icon: <Clock size={14} />,
      value: formatTime(timeSpent),
      label: 'Time'
    }
  ];

  const detailedStats = [
    {
      icon: <Target size={16} />,
      label: 'Progress',
      value: `${questionsAnswered}/${totalQuestions}`,
      secondary: `${Math.round(completionRate)}%`
    },
    {
      icon: <Clock size={16} />,
      label: 'Waktu',
      value: formatTime(timeSpent),
      secondary: `~${Math.round(avgTime)}s/soal`
    },
    {
      icon: <TrendingUp size={16} />,
      label: 'Streak',
      value: currentStreak,
      secondary: 'berturut-turut'
    },
    {
      icon: <Award size={16} />,
      label: 'Kecepatan',
      value: avgTime < 30 ? 'Cepat' : avgTime < 60 ? 'Sedang' : 'Santai',
      secondary: ''
    }
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 z-50">
      <motion.div
        layout
        className="bg-surface-container border border-outline/30 rounded-2xl shadow-lg backdrop-blur-sm"
        style={{ minWidth: isExpanded ? '280px' : '140px' }}
      >
        {/* Header dengan toggle */}
        <motion.div 
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-on-surface" />
            <span className="text-sm font-medium text-on-surface">
              {isExpanded ? 'Live Stats' : 'Stats'}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp size={16} className="text-on-surface-variant" />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 pb-3"
            >
              <div className="flex gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-on-surface-variant">{stat.icon}</span>
                    <span className="text-xs font-medium text-on-surface">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 pb-3"
            >
              <div className="space-y-3">
                {detailedStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-on-surface-variant">{stat.icon}</span>
                      <span className="text-sm text-on-surface-variant">{stat.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-on-surface">{stat.value}</div>
                      {stat.secondary && (
                        <div className="text-xs text-on-surface-variant">{stat.secondary}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FloatingStats;
