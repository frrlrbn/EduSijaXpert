'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '@/hooks/useQuiz';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useQuizReview } from '@/hooks/useQuizReview';
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
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  // Quiz session management
  const {
    hasCompletedQuiz,
    storedAnswers,
    storedResults,
    storedQuestions,
    isLoading: sessionLoading,
    saveQuizSession,
    clearQuizSession,
    getSessionInfo
  } = useQuizSession();
  
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
    bestStreak,
    randomizedQuestions
  } = useQuiz();
  
  // Review mode hook for stored questions
  const reviewQuizHook = useQuizReview(storedQuestions, storedAnswers);

  // Initialize from stored session if exists
  useEffect(() => {
    if (hasCompletedQuiz && storedResults && currentView === 'welcome') {
      const sessionInfo = getSessionInfo();
      if (sessionInfo?.playerName) {
        setPlayerName(sessionInfo.playerName);
      }
      setCurrentView('results');
      setScoreSubmitted(true);
    }
  }, [hasCompletedQuiz, storedResults, getSessionInfo, currentView]);

  const handleStartQuiz = (name) => {
    // Prevent starting if quiz already completed
    if (hasCompletedQuiz) {
      alert('Anda sudah menyelesaikan quiz ini. Silakan lihat hasil atau review jawaban.');
      return;
    }
    
    setPlayerName(name);
    startQuiz();
    setCurrentView('quiz');
    setReviewMode(false);
    setScoreSubmitted(false); // Reset submission flag when starting new quiz
  };

  const handleFinishQuiz = async () => {
    finishQuiz();
    const results = getResults();
    
    // Save quiz session to cookie with randomized questions
    const saved = saveQuizSession(results, selectedAnswers, playerName, randomizedQuestions);
    if (saved) {
      console.log('Quiz session saved successfully');
    }
    
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
    // Only allow restart if no previous session exists
    if (hasCompletedQuiz) {
      alert('Anda sudah menyelesaikan quiz ini sebelumnya. Tidak bisa mengulang quiz.');
      return;
    }
    
    restartQuiz();
    setCurrentView('quiz');
    setReviewMode(false);
    setScoreSubmitted(false); // Reset submission flag when restarting
  };

  const handleReviewAnswers = () => {
    // Simply switch to review mode - the useQuizReview hook will handle the stored data
    if (storedQuestions && storedQuestions.length > 0 && storedAnswers) {
      setReviewMode(true);
      setCurrentView('review');
    } else {
      alert('Data soal review tidak tersedia. Silakan mulai quiz baru.');
    }
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
                hasCompletedQuiz={hasCompletedQuiz}
                onReviewAnswers={handleReviewAnswers}
                storedResult={storedResults}
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
                onPrevious={reviewMode ? previousQuestion : () => {}} // Enable previous only in review mode
                onNext={nextQuestion}
                onFinish={handleFinishQuiz}
                isReviewMode={reviewMode}
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
                results={storedResults || getResults()}
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
                currentQuestion={reviewQuizHook.currentQuestionIndex + 1}
                totalQuestions={reviewQuizHook.totalQuestions}
                progress={reviewQuizHook.getProgress()}
                timeSpent={timeSpent}
                score={reviewQuizHook.getResults().percentage}
                showScore={true}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={reviewQuizHook.currentQuestionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <QuizCard
                    question={reviewQuizHook.getCurrentQuestion()}
                    selectedAnswer={reviewQuizHook.selectedAnswers[reviewQuizHook.getCurrentQuestion()?.id]}
                    onSelectAnswer={null}
                    showCorrectAnswer={true}
                  />
                </motion.div>
              </AnimatePresence>

              <QuizNavigation
                canGoPrevious={reviewQuizHook.currentQuestionIndex > 0}
                canGoNext={reviewQuizHook.currentQuestionIndex < reviewQuizHook.totalQuestions - 1}
                isAnswerSelected={true}
                isLastQuestion={reviewQuizHook.currentQuestionIndex === reviewQuizHook.totalQuestions - 1}
                onPrevious={reviewQuizHook.previousQuestion} // Always enabled in review mode
                onNext={reviewQuizHook.nextQuestion}
                onFinish={handleBackToResults}
                isReviewMode={true}
              />
              
              <KeyboardShortcuts
                onNext={reviewQuizHook.nextQuestion}
                onPrevious={reviewQuizHook.previousQuestion}
                onFinish={handleBackToResults}
                canGoNext={reviewQuizHook.currentQuestionIndex < reviewQuizHook.totalQuestions - 1}
                canGoPrevious={reviewQuizHook.currentQuestionIndex > 0}
                isLastQuestion={reviewQuizHook.currentQuestionIndex === reviewQuizHook.totalQuestions - 1}
                isAnswerSelected={true}
              />
              
              <QuizStats
                questionsAnswered={reviewQuizHook.totalQuestions}
                totalQuestions={reviewQuizHook.totalQuestions}
                timeSpent={timeSpent}
                currentStreak={0}
                averageTimePerQuestion={0}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer - Hidden during quiz and review, shown on welcome and results */}
      <AnimatePresence>
        {(currentView === 'welcome' || currentView === 'results') && (
          <motion.div
            key="footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizApp;
