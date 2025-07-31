import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const QUIZ_SESSION_KEY = 'pancasila_quiz_session';
const QUIZ_ANSWERS_KEY = 'pancasila_quiz_answers';

export const useQuizSession = () => {
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [storedAnswers, setStoredAnswers] = useState([]);
  const [storedResults, setStoredResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = () => {
    try {
      const sessionData = Cookies.get(QUIZ_SESSION_KEY);
      const answersData = Cookies.get(QUIZ_ANSWERS_KEY);
      
      if (sessionData) {
        const session = JSON.parse(sessionData);
        setHasCompletedQuiz(true);
        setStoredResults(session.results);
        
        if (answersData) {
          setStoredAnswers(JSON.parse(answersData));
        }
      }
    } catch (error) {
      console.error('Error reading quiz session:', error);
      // Clear corrupted data
      Cookies.remove(QUIZ_SESSION_KEY);
      Cookies.remove(QUIZ_ANSWERS_KEY);
    }
    setIsLoading(false);
  };

  const saveQuizSession = (results, answers, playerName) => {
    try {
      const sessionData = {
        completedAt: new Date().toISOString(),
        results,
        playerName,
        version: '1.0'
      };

      // Set cookie to expire in 24 hours
      Cookies.set(QUIZ_SESSION_KEY, JSON.stringify(sessionData), { 
        expires: 1,
        sameSite: 'strict'
      });
      
      Cookies.set(QUIZ_ANSWERS_KEY, JSON.stringify(answers), { 
        expires: 1,
        sameSite: 'strict'
      });

      setHasCompletedQuiz(true);
      setStoredResults(results);
      setStoredAnswers(answers);
      
      return true;
    } catch (error) {
      console.error('Error saving quiz session:', error);
      return false;
    }
  };

  const clearQuizSession = () => {
    Cookies.remove(QUIZ_SESSION_KEY);
    Cookies.remove(QUIZ_ANSWERS_KEY);
    setHasCompletedQuiz(false);
    setStoredAnswers([]);
    setStoredResults(null);
  };

  const getSessionInfo = () => {
    try {
      const sessionData = Cookies.get(QUIZ_SESSION_KEY);
      if (sessionData) {
        return JSON.parse(sessionData);
      }
    } catch (error) {
      console.error('Error getting session info:', error);
    }
    return null;
  };

  return {
    hasCompletedQuiz,
    storedAnswers,
    storedResults,
    isLoading,
    saveQuizSession,
    clearQuizSession,
    getSessionInfo
  };
};
