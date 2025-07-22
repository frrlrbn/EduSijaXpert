'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import clsx from 'clsx';

const QuizCard = ({ 
  question, 
  selectedAnswer, 
  onSelectAnswer, 
  showCorrectAnswer = false,
  className 
}) => {
  const { id, question: questionText, options, correctAnswer, explanation } = question;

  const handleOptionClick = (optionIndex) => {
    if (!showCorrectAnswer && onSelectAnswer) {
      onSelectAnswer(id, optionIndex);
    }
  };

  const getOptionStatus = (optionIndex) => {
    if (!showCorrectAnswer) {
      return selectedAnswer === optionIndex ? 'selected' : 'default';
    }
    
    if (optionIndex === correctAnswer) {
      return 'correct';
    }
    
    if (selectedAnswer === optionIndex && optionIndex !== correctAnswer) {
      return 'incorrect';
    }
    
    return 'default';
  };

  return (
    <Card elevation={2} className={clsx("p-4 md:p-6 w-full max-w-3xl mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Question */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-on-surface leading-relaxed">
            {questionText}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          {options.map((option, index) => {
            const status = getOptionStatus(index);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <Button
                  variant={status === 'selected' ? 'filled' : 'outlined'}
                  size="large"
                  className={clsx(
                    "w-full text-left justify-start p-3 md:p-4 h-auto min-h-[50px] md:min-h-[60px] rounded-xl md:rounded-2xl",
                    status === 'correct' && "bg-success-container text-on-success-container border-success",
                    status === 'incorrect' && "bg-error-container text-on-error-container border-error",
                    status === 'selected' && !showCorrectAnswer && "bg-primary text-on-primary",
                    "hover:scale-[1.01] transition-all duration-200 text-sm md:text-base"
                  )}
                  onClick={() => handleOptionClick(index)}
                  disabled={showCorrectAnswer}
                >
                  <div className="flex items-center w-full">
                    <div className={clsx(
                      "flex items-center justify-center w-8 h-8 rounded-full mr-4 flex-shrink-0",
                      status === 'correct' && "bg-success text-on-success",
                      status === 'incorrect' && "bg-error text-on-error",
                      status === 'selected' && !showCorrectAnswer && "bg-on-primary text-primary",
                      status === 'default' && "bg-surface-variant text-on-surface-variant"
                    )}>
                      {showCorrectAnswer ? (
                        status === 'correct' ? (
                          <Check size={16} />
                        ) : status === 'incorrect' ? (
                          <X size={16} />
                        ) : (
                          String.fromCharCode(65 + index)
                        )
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    
                    <span className="text-sm md:text-base leading-relaxed flex-1">
                      {option}
                    </span>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Explanation (shown when answer is revealed) */}
        <AnimatePresence>
          {showCorrectAnswer && explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-surface-container-high rounded-2xl"
            >
              <h3 className="font-semibold text-on-surface mb-2 flex items-center">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center mr-2">
                  <Check size={14} className="text-on-success" />
                </div>
                Penjelasan
              </h3>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                {explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Card>
  );
};

export default QuizCard;
