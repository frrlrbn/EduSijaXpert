'use client';

import { useEffect } from 'react';

const KeyboardShortcuts = ({ 
  onNext, 
  onPrevious, 
  onFinish, 
  canGoNext, 
  canGoPrevious, 
  isLastQuestion,
  isAnswerSelected 
}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle shortcuts if no input is focused
      if (document.activeElement.tagName === 'INPUT' || 
          document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
          event.preventDefault();
          if (isAnswerSelected && canGoNext && onNext) {
            onNext();
          } else if (isAnswerSelected && isLastQuestion && onFinish) {
            onFinish();
          }
          break;
        
        case 'ArrowLeft':
          event.preventDefault();
          if (canGoPrevious && onPrevious) {
            onPrevious();
          }
          break;
        
        case 'Enter':
          event.preventDefault();
          if (isAnswerSelected && isLastQuestion && onFinish) {
            onFinish();
          } else if (isAnswerSelected && canGoNext && onNext) {
            onNext();
          }
          break;
        
        case '1':
        case '2':
        case '3':
        case '4':
          event.preventDefault();
          // This would require passing the selectAnswer function and current question
          // We'll implement this if needed
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNext, onPrevious, onFinish, canGoNext, canGoPrevious, isLastQuestion, isAnswerSelected]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;
