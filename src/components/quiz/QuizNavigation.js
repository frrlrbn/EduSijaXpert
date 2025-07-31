'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const QuizNavigation = ({ 
  canGoPrevious, 
  canGoNext, 
  isAnswerSelected,
  isLastQuestion,
  onPrevious, 
  onNext, 
  onFinish,
  disabled = false,
  isReviewMode = false // New prop to detect review mode
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex justify-between items-center w-full max-w-3xl mx-auto mt-6 md:mt-8 gap-2 md:gap-4"
    >
      {/* Previous Button - Enabled only in review mode */}
      {isReviewMode ? (
        <Button
          variant="outlined"
          size="medium"
          disabled={!canGoPrevious || disabled}
          onClick={onPrevious}
          icon={<ChevronLeft size={16} className="md:w-[18px] md:h-[18px]" />}
          className="flex-shrink-0 text-sm md:text-base px-3 md:px-4 py-2 md:py-3"
        >
          <span className="hidden sm:inline">Sebelumnya</span>
          <span className="sm:hidden">Prev</span>
        </Button>
      ) : (
        /* Placeholder to maintain layout in quiz mode */
        <div className="flex-shrink-0 w-20 md:w-28"></div>
      )}

      {/* Answer Status Indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 17 }}
        className="flex items-center gap-1 md:gap-2 px-2 md:px-4 flex-1 justify-center"
      >
        {isAnswerSelected ? (
          <div className="flex items-center gap-1 md:gap-2 text-success">
            <CheckCircle size={14} className="md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium text-center">
              <span className="hidden sm:inline">Jawaban dipilih</span>
              <span className="sm:hidden">✓ Dipilih</span>
            </span>
          </div>
        ) : (
          <div className="text-on-surface-variant text-center">
            <span className="text-xs md:text-sm">
              <span className="hidden sm:inline">Pilih jawaban untuk melanjutkan</span>
              <span className="sm:hidden">Pilih jawaban</span>
            </span>
          </div>
        )}
      </motion.div>

      {/* Next/Finish Button */}
      {isLastQuestion ? (
        <Button
          variant="filled"
          size="medium"
          disabled={!isAnswerSelected || disabled}
          onClick={onFinish}
          icon={<CheckCircle size={16} className="md:w-[18px] md:h-[18px]" />}
          className="flex-shrink-0 bg-success text-on-success hover:bg-success/90 text-sm md:text-base px-3 md:px-4 py-2 md:py-3"
        >
          Selesai
        </Button>
      ) : (
        <Button
          variant="filled"
          size="medium"
          disabled={!isAnswerSelected || disabled}
          onClick={onNext}
          icon={<ChevronRight size={16} className="md:w-[18px] md:h-[18px]" />}
          className="flex-shrink-0 text-sm md:text-base px-3 md:px-4 py-2 md:py-3"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <span className="sm:hidden">Next</span>
        </Button>
      )}
    </motion.div>
  );
};

export default QuizNavigation;
