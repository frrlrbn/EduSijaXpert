'use client';

import { motion } from 'framer-motion';
import { Clock, Trophy, Target } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import Card from '../ui/Card';

const QuizHeader = ({ 
  currentQuestion, 
  totalQuestions, 
  progress, 
  timeSpent,
  score,
  showScore = false 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card elevation={1} className="p-3 md:p-4 lg:p-6 w-full max-w-3xl mx-auto mb-4 md:mb-6">
      <div className="space-y-3 md:space-y-4">
        {/* Top Row - Question Counter and Time */}
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 md:gap-2"
          >
            <Target size={16} className="md:w-[18px] md:h-[18px] text-primary" />
            <span className="text-xs md:text-sm lg:text-base font-medium text-on-surface">
              <span className="hidden sm:inline">Pertanyaan {currentQuestion} dari {totalQuestions}</span>
              <span className="sm:hidden">{currentQuestion}/{totalQuestions}</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 md:gap-4"
          >
            {showScore && (
              <div className="flex items-center gap-1 md:gap-2">
                <Trophy size={16} className="md:w-[18px] md:h-[18px] text-warning" />
                <span className="text-xs md:text-sm lg:text-base font-medium text-on-surface">
                  {score}%
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1 md:gap-2">
              <Clock size={16} className="md:w-[18px] md:h-[18px] text-secondary" />
              <span className="text-xs md:text-sm lg:text-base font-medium text-on-surface-variant">
                {formatTime(timeSpent)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProgressBar 
            value={progress} 
            max={100} 
            variant="primary"
            size="small"
            className="md:h-2 lg:h-3"
          />
        </motion.div>

        {/* Progress Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <span className="text-xs md:text-sm text-on-surface-variant">
            <span className="hidden sm:inline">{Math.round(progress)}% selesai</span>
            <span className="sm:hidden">{Math.round(progress)}%</span>
          </span>
        </motion.div>
      </div>
    </Card>
  );
};

export default QuizHeader;
