'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '@/hooks/useQuiz';
import QuizWelcome from './QuizWelcome';
import QuizHeader from './QuizHeader';
import QuizCard from './QuizCard';
import QuizNavigation from './QuizNavigation';
import QuizResults from './QuizResults';
import KeyboardShortcuts from '../ui/KeyboardShortcuts';
import KeyboardShortcutsHelp from '../ui/KeyboardShortcutsHelp';
import QuizStats from './QuizStats';
import FloatingStats from '../ui/FloatingStats';
import Footer from '../ui/Footer';

const QuizApp = () => {
  const [currentView, setCurrentView] = useState('welcome'); // welcome, quiz, results, review
  const [reviewMode, setReviewMode] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false); // Track if score is already submitted
  
  const {
    currentQuestionIndex,
    selectedAnswers,
    isQuizComplete,
    timeSpent,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    restartQuiz,
    getCurrentQuestion,
    getResults,
    getProgress,
    isAnswerSelected,
    totalQuestions,
    hasStarted,
    getQuestionsAnswered,
    getAverageTimePerQuestion,
    currentStreak,
    bestStreak
  } = useQuiz();

  const handleStartQuiz = (name) => {
    setPlayerName(name);
    startQuiz();
    setCurrentView('quiz');
    setReviewMode(false);
    setScoreSubmitted(false); // Reset submission flag when starting new quiz
  };

  const handleFinishQuiz = async () => {
    finishQuiz();
    setCurrentView('results');
    
    // Submit score only when quiz is finished for the first time
    if (playerName && !scoreSubmitted) {
      await submitScore();
    }
  };

  const submitScore = async () => {
    try {
      console.log('Submitting score for the first time:', { playerName, scoreSubmitted });
      
      const results = getResults();
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName,
          score: results.percentage,
          timeSpent: timeSpent,
          category: 'Programming Quiz'
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setScoreSubmitted(true);
        console.log('Score submitted successfully');
        
        // Also update platform stats directly
        await updatePlatformStats(results);
      }
    } catch (error) {
      console.error('Score submission failed:', error);
    }
  };

  const updatePlatformStats = async (results) => {
    try {
      console.log('Updating platform stats from QuizApp:', results);
      
      await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'quiz_completed',
          score: results.percentage,
          timeSpent: timeSpent,
          category: 'Programming Quiz',
          data: {
            score: results.percentage,
            category: 'Programming Quiz',
            correctAnswers: results.correctAnswers,
            totalQuestions: results.totalQuestions,
            timeSpent: timeSpent
          }
        }),
      });
      
      console.log('Platform stats updated from QuizApp');
    } catch (error) {
      console.error('Failed to update platform stats from QuizApp:', error);
    }
  };

  const handleRestartQuiz = () => {
    restartQuiz();
    setCurrentView('quiz');
    setReviewMode(false);
    setScoreSubmitted(false); // Reset submission flag when restarting
  };

  const handleReviewAnswers = () => {
    setCurrentView('review');
    setReviewMode(true);
  };

  const handleBackToResults = () => {
    setCurrentView('results');
    setReviewMode(false);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 0.95 }
  };

  const pageTransition = {
    type: "tween",
    ease: [0.4, 0, 0.2, 1],
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <KeyboardShortcutsHelp />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'welcome' && (
            <motion.div
              key="welcome"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <QuizWelcome 
                onStartQuiz={handleStartQuiz}
                totalQuestions={totalQuestions}
              />
            </motion.div>
          )}

          {currentView === 'quiz' && (
            <motion.div
              key="quiz"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-4 md:space-y-6"
            >
              <QuizHeader
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
                progress={getProgress()}
                timeSpent={timeSpent}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="pb-4 md:pb-0"
                >
                  <QuizCard
                    question={getCurrentQuestion()}
                    selectedAnswer={selectedAnswers[getCurrentQuestion()?.id]}
                    onSelectAnswer={selectAnswer}
                    showCorrectAnswer={false}
                  />
                </motion.div>
              </AnimatePresence>

              <QuizNavigation
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={currentQuestionIndex < totalQuestions - 1}
                isAnswerSelected={isAnswerSelected()}
                isLastQuestion={currentQuestionIndex === totalQuestions - 1}
                onPrevious={previousQuestion}
                onNext={nextQuestion}
                onFinish={handleFinishQuiz}
              />
              
              <KeyboardShortcuts
                onNext={nextQuestion}
                onPrevious={previousQuestion}
                onFinish={handleFinishQuiz}
                canGoNext={currentQuestionIndex < totalQuestions - 1}
                canGoPrevious={currentQuestionIndex > 0}
                isLastQuestion={currentQuestionIndex === totalQuestions - 1}
                isAnswerSelected={isAnswerSelected()}
              />
              
              {/* Desktop Stats - tersembunyi pada mobile */}
              <div className="hidden md:block">
                <QuizStats
                  questionsAnswered={getQuestionsAnswered()}
                  totalQuestions={totalQuestions}
                  timeSpent={timeSpent}
                  currentStreak={currentStreak}
                  averageTimePerQuestion={getAverageTimePerQuestion()}
                />
              </div>

              {/* Floating Stats untuk mobile */}
              <FloatingStats
                questionsAnswered={getQuestionsAnswered()}
                totalQuestions={totalQuestions}
                timeSpent={timeSpent}
                currentStreak={currentStreak}
                averageTimePerQuestion={getAverageTimePerQuestion()}
              />
            </motion.div>
          )}

          {currentView === 'results' && (
            <motion.div
              key="results"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <QuizResults
                results={getResults()}
                playerName={playerName}
                onRestart={handleRestartQuiz}
                onReview={handleReviewAnswers}
                scoreSubmitted={scoreSubmitted}
              />
            </motion.div>
          )}

          {currentView === 'review' && (
            <motion.div
              key="review"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-6"
            >
              <QuizHeader
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
                progress={getProgress()}
                timeSpent={timeSpent}
                score={getResults().percentage}
                showScore={true}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <QuizCard
                    question={getCurrentQuestion()}
                    selectedAnswer={selectedAnswers[getCurrentQuestion()?.id]}
                    onSelectAnswer={null}
                    showCorrectAnswer={true}
                  />
                </motion.div>
              </AnimatePresence>

              <QuizNavigation
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={currentQuestionIndex < totalQuestions - 1}
                isAnswerSelected={true}
                isLastQuestion={currentQuestionIndex === totalQuestions - 1}
                onPrevious={previousQuestion}
                onNext={nextQuestion}
                onFinish={handleBackToResults}
              />
              
              <KeyboardShortcuts
                onNext={nextQuestion}
                onPrevious={previousQuestion}
                onFinish={handleBackToResults}
                canGoNext={currentQuestionIndex < totalQuestions - 1}
                canGoPrevious={currentQuestionIndex > 0}
                isLastQuestion={currentQuestionIndex === totalQuestions - 1}
                isAnswerSelected={true}
              />
              
              <QuizStats
                questionsAnswered={getQuestionsAnswered()}
                totalQuestions={totalQuestions}
                timeSpent={timeSpent}
                currentStreak={currentStreak}
                averageTimePerQuestion={getAverageTimePerQuestion()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Footer />
    </div>
  );
};

export default QuizApp;
