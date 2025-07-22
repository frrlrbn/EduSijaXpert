'use client';

import { useState, useCallback, useEffect } from 'react';
import { quizData } from '@/data/quizData';

export const useQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timePerQuestion, setTimePerQuestion] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Timer effect
  useEffect(() => {
    if (startTime && !isQuizComplete) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isQuizComplete]);

  // Question timer effect
  useEffect(() => {
    if (questionStartTime) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex]);

  const startQuiz = useCallback(() => {
    const now = Date.now();
    setStartTime(now);
    setQuestionStartTime(now);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsQuizComplete(false);
    setShowResults(false);
    setTimeSpent(0);
    setTimePerQuestion({});
    setCurrentStreak(0);
    setBestStreak(0);
  }, []);

  const selectAnswer = useCallback((questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));

    // Update streak
    const question = quizData.find(q => q.id === questionId);
    if (question) {
      if (answerIndex === question.correctAnswer) {
        setCurrentStreak(prev => {
          const newStreak = prev + 1;
          setBestStreak(current => Math.max(current, newStreak));
          return newStreak;
        });
      } else {
        setCurrentStreak(0);
      }
    }
  }, []);

  const nextQuestion = useCallback(() => {
    // Record time spent on current question
    if (questionStartTime) {
      const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
      setTimePerQuestion(prev => ({
        ...prev,
        [quizData[currentQuestionIndex].id]: timeSpentOnQuestion
      }));
    }

    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      setIsQuizComplete(true);
    }
  }, [currentQuestionIndex, questionStartTime]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex]);

  const finishQuiz = useCallback(() => {
    // Record time for last question
    if (questionStartTime) {
      const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
      setTimePerQuestion(prev => ({
        ...prev,
        [quizData[currentQuestionIndex].id]: timeSpentOnQuestion
      }));
    }
    
    setIsQuizComplete(true);
    setShowResults(true);
  }, [currentQuestionIndex, questionStartTime]);

  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);

  const getResults = useCallback(() => {
    let correctAnswers = 0;
    let totalQuestions = quizData.length;

    quizData.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'E';
    
    const answeredQuestions = Object.keys(selectedAnswers).length;
    const avgTimePerQuestion = answeredQuestions > 0 ? timeSpent / answeredQuestions : 0;

    return {
      correctAnswers,
      totalQuestions,
      percentage,
      grade,
      timeSpent,
      timePerQuestion,
      currentStreak,
      bestStreak,
      avgTimePerQuestion
    };
  }, [selectedAnswers, timeSpent, timePerQuestion, currentStreak, bestStreak]);

  const getCurrentQuestion = useCallback(() => {
    return quizData[currentQuestionIndex];
  }, [currentQuestionIndex]);

  const getProgress = useCallback(() => {
    return ((currentQuestionIndex + 1) / quizData.length) * 100;
  }, [currentQuestionIndex]);

  const isAnswerSelected = useCallback(() => {
    const currentQuestion = getCurrentQuestion();
    return selectedAnswers[currentQuestion?.id] !== undefined;
  }, [getCurrentQuestion, selectedAnswers]);

  const getQuestionsAnswered = useCallback(() => {
    return Object.keys(selectedAnswers).length;
  }, [selectedAnswers]);

  const getAverageTimePerQuestion = useCallback(() => {
    const answered = getQuestionsAnswered();
    return answered > 0 ? timeSpent / answered : 0;
  }, [timeSpent, getQuestionsAnswered]);

  return {
    // State
    currentQuestionIndex,
    selectedAnswers,
    isQuizComplete,
    showResults,
    timeSpent,
    timePerQuestion,
    
    // Actions
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    restartQuiz,
    
    // Getters
    getCurrentQuestion,
    getResults,
    getProgress,
    isAnswerSelected,
    
    // Utils
    totalQuestions: quizData.length,
    hasStarted: startTime !== null,
    getQuestionsAnswered,
    getAverageTimePerQuestion,
    currentStreak,
    bestStreak
  };
};
