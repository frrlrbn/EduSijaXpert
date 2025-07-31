'use client';

import { useState, useCallback, useEffect } from 'react';
import { quizData } from '@/data/quizData';

const QUIZ_LENGTH = 15; // Jumlah soal yang akan ditampilkan

// Fungsi untuk mengacak array dan mengambil sejumlah elemen
const shuffleAndTake = (array, count) => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const useQuiz = () => {
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
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
    // Generate random questions for this quiz session
    const randomQuestions = shuffleAndTake(quizData, QUIZ_LENGTH);
    setRandomizedQuestions(randomQuestions);
    
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
    const question = randomizedQuestions.find(q => q.id === questionId);
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
  }, [randomizedQuestions]);

  const nextQuestion = useCallback(() => {
    // Record time spent on current question
    if (questionStartTime && randomizedQuestions.length > 0) {
      const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
      setTimePerQuestion(prev => ({
        ...prev,
        [randomizedQuestions[currentQuestionIndex].id]: timeSpentOnQuestion
      }));
    }

    if (currentQuestionIndex < randomizedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      setIsQuizComplete(true);
    }
  }, [currentQuestionIndex, questionStartTime, randomizedQuestions]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex]);

  const finishQuiz = useCallback(() => {
    // Record time for last question
    if (questionStartTime && randomizedQuestions.length > 0) {
      const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
      setTimePerQuestion(prev => ({
        ...prev,
        [randomizedQuestions[currentQuestionIndex].id]: timeSpentOnQuestion
      }));
    }
    
    setIsQuizComplete(true);
    setShowResults(true);
  }, [currentQuestionIndex, questionStartTime, randomizedQuestions]);

  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);

  const getResults = useCallback(() => {
    let correctAnswers = 0;
    let totalQuestions = randomizedQuestions.length;

    randomizedQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
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
      avgTimePerQuestion,
      correctCount: correctAnswers // Alias untuk kompatibilitas
    };
  }, [selectedAnswers, timeSpent, timePerQuestion, currentStreak, bestStreak, randomizedQuestions]);

  const getCurrentQuestion = useCallback(() => {
    return randomizedQuestions[currentQuestionIndex];
  }, [currentQuestionIndex, randomizedQuestions]);

  const getProgress = useCallback(() => {
    return randomizedQuestions.length > 0 ? ((currentQuestionIndex + 1) / randomizedQuestions.length) * 100 : 0;
  }, [currentQuestionIndex, randomizedQuestions]);

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
    randomizedQuestions,
    
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
    totalQuestions: randomizedQuestions.length > 0 ? randomizedQuestions.length : QUIZ_LENGTH,
    hasStarted: startTime !== null,
    getQuestionsAnswered,
    getAverageTimePerQuestion,
    currentStreak,
    bestStreak
  };
};
