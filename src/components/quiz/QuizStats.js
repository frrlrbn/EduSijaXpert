'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import Card from '../ui/Card';

const QuizStats = ({ 
  questionsAnswered, 
  totalQuestions, 
  timeSpent, 
  currentStreak,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-40 hidden lg:block"
    >
      <Card elevation={2} className="p-4 bg-surface-container-high">
        <h4 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
          <TrendingUp size={16} />
          Statistik Live
        </h4>
        
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="text-primary">
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-on-surface-variant">
                  {stat.label}
                </div>
                <div className="text-sm font-medium text-on-surface truncate">
                  {stat.value}
                </div>
                {stat.secondary && (
                  <div className="text-xs text-on-surface-variant">
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
