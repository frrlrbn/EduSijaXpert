'use client';

import { useState, useCallback, useEffect } from 'react';

export const useQuizReview = (storedQuestions, storedAnswers) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(storedAnswers || {});

  // Initialize review with stored data
  useEffect(() => {
    if (storedAnswers) {
      setSelectedAnswers(storedAnswers);
    }
  }, [storedAnswers]);

  const selectAnswer = useCallback((questionId, answerIndex) => {
    // In review mode, this is read-only, but we keep the interface consistent
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < storedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, storedQuestions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const getCurrentQuestion = useCallback(() => {
    return storedQuestions[currentQuestionIndex];
  }, [currentQuestionIndex, storedQuestions]);

  const getProgress = useCallback(() => {
    return storedQuestions.length > 0 ? ((currentQuestionIndex + 1) / storedQuestions.length) * 100 : 0;
  }, [currentQuestionIndex, storedQuestions.length]);

  const isAnswerSelected = useCallback(() => {
    const currentQuestion = getCurrentQuestion();
    return selectedAnswers[currentQuestion?.id] !== undefined;
  }, [getCurrentQuestion, selectedAnswers]);

  const getResults = useCallback(() => {
    let correctAnswers = 0;
    let totalQuestions = storedQuestions.length;

    storedQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'E';

    return {
      correctAnswers,
      totalQuestions,
      percentage,
      grade,
      correctCount: correctAnswers
    };
  }, [selectedAnswers, storedQuestions]);

  return {
    // State
    currentQuestionIndex,
    selectedAnswers,
    
    // Actions
    selectAnswer,
    nextQuestion,
    previousQuestion,
    
    // Getters
    getCurrentQuestion,
    getResults,
    getProgress,
    isAnswerSelected,
    
    // Utils
    totalQuestions: storedQuestions.length,
    hasQuestions: storedQuestions.length > 0
  };
};
