'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import Card from '../ui/Card';

const QuizStats = ({ 
  questionsAnswered, 
  totalQuestions, 
  timeSpent,
  averageTimePerQuestion 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completionRate = (questionsAnswered / totalQuestions) * 100;
  const avgTime = averageTimePerQuestion || (timeSpent / Math.max(questionsAnswered, 1));

  const stats = [
    {
      icon: <Target size={12} className="lg:w-4 lg:h-4" />,
      label: 'Progress',
      value: `${questionsAnswered}/${totalQuestions}`,
      secondary: `${Math.round(completionRate)}%`
    },
    {
      icon: <Clock size={12} className="lg:w-4 lg:h-4" />,
      label: 'Waktu',
      value: formatTime(timeSpent),
      secondary: `~${Math.round(avgTime)}s/soal`
    },
    {
      icon: <Award size={12} className="lg:w-4 lg:h-4" />,
      label: 'Kecepatan',
      value: avgTime < 30 ? 'Cepat' : avgTime < 60 ? 'Sedang' : 'Santai',
      secondary: ''
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-40 lg:bottom-6 lg:left-6 max-w-[140px] lg:max-w-none"
    >
      <Card elevation={2} className="p-2 lg:p-4 bg-surface-container-high border border-outline/20">
        <h4 className="text-xs lg:text-sm font-semibold text-on-surface mb-2 lg:mb-3 flex items-center gap-1 lg:gap-2">
          <TrendingUp size={12} className="lg:w-4 lg:h-4 flex-shrink-0" />
          <span className="hidden sm:inline truncate">Statistik Live</span>
          <span className="sm:hidden truncate">Stats</span>
        </h4>
        
        <div className="space-y-1.5 lg:space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-1.5 lg:gap-3"
            >
              <div className="text-primary flex-shrink-0">
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-on-surface-variant truncate">
                  {stat.label}
                </div>
                <div className="text-xs lg:text-sm font-medium text-on-surface truncate">
                  {stat.value}
                </div>
                {stat.secondary && (
                  <div className="text-xs text-on-surface-variant truncate">
                    {stat.secondary}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default QuizStats;
