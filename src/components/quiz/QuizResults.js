'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, Share2, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import Leaderboard from '../ui/Leaderboard';
import StatsDashboard from '../ui/StatsDashboard';

const QuizResults = ({ results, playerName, onRestart, onReview, scoreSubmitted: scoreAlreadySubmitted = false }) => {
  // Safety check and defaults for results
  const safeResults = results || {};
  const { 
    correctAnswers = 0, 
    totalQuestions = 0, 
    percentage = 0, 
    grade = 'E', 
    timeSpent = 0,
    avgTimePerQuestion = 0
  } = safeResults;
  
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [statsUpdated, setStatsUpdated] = useState(false);

  // Update API stats when component mounts (stats are safe to update multiple times)
  useEffect(() => {
    if (totalQuestions > 0) { // Only update if we have valid results
      updateStats();
    }
  }, [totalQuestions]); // Depend on totalQuestions to ensure we have data

  const updateStats = async () => {
    try {
      console.log('Updating platform stats:', { percentage, timeSpent, correctAnswers, totalQuestions });
      
      const response = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'quiz_completed',
          score: percentage,
          timeSpent: timeSpent,
          category: 'Programming Quiz',
          data: {
            score: percentage,
            category: 'Programming Quiz',
            correctAnswers,
            totalQuestions,
            timeSpent
          }
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setStatsUpdated(true);
        console.log('Platform stats updated successfully');
      } else {
        console.error('Failed to update platform stats:', result.error);
      }
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-success';
      case 'B': return 'text-success';
      case 'C': return 'text-warning';
      case 'D': return 'text-warning';
      case 'E': return 'text-error';
      default: return 'text-on-surface';
    }
  };

  const getGradeMessage = (percentage) => {
    if (percentage >= 90) return "Luar biasa! 🎉";
    if (percentage >= 80) return "Sangat baik! 👏";
    if (percentage >= 70) return "Baik! 👍";
    if (percentage >= 60) return "Cukup baik 😊";
    return "Perlu lebih banyak belajar 📚";
  };

  const getAchievementBadges = (percentage, timeSpent, totalQuestions) => {
    const badges = [];
    const avgTime = timeSpent / totalQuestions;
    
    if (percentage === 100) badges.push({ icon: "🏆", text: "Perfect Score!" });
    if (percentage >= 90) badges.push({ icon: "⭐", text: "Excellent!" });
    if (avgTime < 15) badges.push({ icon: "⚡", text: "Speed Demon!" });
    if (avgTime < 30) badges.push({ icon: "🚀", text: "Quick Thinker!" });
    if (percentage >= 70) badges.push({ icon: "🎯", text: "Good Job!" });
    
    return badges;
  };

  const achievements = getAchievementBadges(percentage, timeSpent, totalQuestions);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0"
    >
      {/* Show loading or error message if no valid results */}
      {totalQuestions === 0 ? (
        <Card elevation={3} className="p-6 text-center">
          <div className="space-y-4">
            <Clock size={48} className="mx-auto text-on-surface-variant mb-4" />
            <h2 className="text-xl font-semibold text-on-surface">
              Memuat Hasil Quiz...
            </h2>
            <p className="text-on-surface-variant">
              Sedang mengambil data hasil quiz Anda. Mohon tunggu sebentar.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Main Results Card */}
          <Card elevation={3} className="p-4 md:p-6 lg:p-8 text-center">
            <motion.div variants={itemVariants}>
              <div className="mb-4 md:mb-6">
                <Trophy size={48} className="md:w-16 md:h-16 mx-auto text-warning mb-3 md:mb-4" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface mb-2">
                  Quiz Selesai!
                </h1>
                <p className="text-base md:text-lg text-on-surface-variant">
                  {getGradeMessage(percentage)}
                </p>
              </div>
        </motion.div>

        {/* Grade Circle - Responsive */}
        <motion.div 
          variants={itemVariants}
          className="mb-6 md:mb-8"
        >
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-surface-variant opacity-20"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-primary"
                initial={{ strokeDasharray: "0 314" }}
                animate={{ strokeDasharray: `${(percentage / 100) * 314} 314` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl md:text-3xl font-bold ${getGradeColor(grade)}`}>
                  {grade}
                </div>
                <div className="text-xs md:text-sm text-on-surface-variant">
                  {percentage}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <ProgressBar 
            value={percentage}
            max={100}
            variant={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
            size="medium"
            showLabel
            label={`${correctAnswers} dari ${totalQuestions} benar`}
            className="text-sm md:text-base"
          />
        </motion.div>

        {/* Achievement Badges */}
        {achievements.length > 0 && (
          <motion.div 
            variants={itemVariants} 
            className="mb-4 md:mb-6"
          >
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {achievements.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 1.5 + (index * 0.2), 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 15 
                  }}
                  className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2"
                >
                  <span className="text-sm md:text-base">{badge.icon}</span>
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </Card>

      {/* Stats Cards - Mobile Responsive Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Card elevation={2} className="p-4 md:p-6 text-center h-full">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 400, damping: 20 }}
            >
              <Target size={24} className="md:w-8 md:h-8 mx-auto text-primary mb-2 md:mb-3" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-lg md:text-2xl font-bold text-on-surface mb-1"
            >
              {correctAnswers}/{totalQuestions}
            </motion.div>
            <div className="text-xs md:text-sm text-on-surface-variant">
              Jawaban Benar
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Card elevation={2} className="p-4 md:p-6 text-center h-full">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 400, damping: 20 }}
            >
              <Clock size={24} className="md:w-8 md:h-8 mx-auto text-secondary mb-2 md:mb-3" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-lg md:text-2xl font-bold text-on-surface mb-1"
            >
              {formatTime(timeSpent)}
            </motion.div>
            <div className="text-xs md:text-sm text-on-surface-variant">
              Total Waktu
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Card elevation={2} className="p-4 md:p-6 text-center h-full">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, type: "spring", stiffness: 400, damping: 20 }}
            >
              <TrendingUp size={24} className="md:w-8 md:h-8 mx-auto text-success mb-2 md:mb-3" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-lg md:text-2xl font-bold text-on-surface mb-1"
            >
              {Math.round(timeSpent / totalQuestions)}s
            </motion.div>
            <div className="text-xs md:text-sm text-on-surface-variant">
              Rata-rata per Soal
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Action Buttons - Mobile Stack */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="w-full md:w-auto"
        >
          <Button
            variant="filled"
            size="large"
            onClick={onReview}
            icon={<Target size={16} className="md:w-[18px] md:h-[18px]" />}
            className="w-full md:w-auto md:flex-none text-sm md:text-base py-3 md:py-2 min-h-[48px] md:min-h-[44px] bg-primary text-on-primary hover:bg-primary/90"
          >
            Review Jawaban
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="w-full md:w-auto"
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => setShowLeaderboard(true)}
            icon={<Trophy size={16} className="md:w-[18px] md:h-[18px]" />}
            className="w-full md:w-auto md:flex-none text-sm md:text-base py-3 md:py-2 min-h-[48px] md:min-h-[44px] border-warning text-warning hover:bg-warning/10"
          >
            Leaderboard
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="w-full md:w-auto"
        >
          <Button
            variant="tonal"
            size="large"
            icon={<Share2 size={16} className="md:w-[18px] md:h-[18px]" />}
            className="w-full md:w-auto md:flex-none text-sm md:text-base py-3 md:py-2 min-h-[48px] md:min-h-[44px] bg-secondary/20 text-secondary hover:bg-secondary/30"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Quiz App Results',
                  text: `Saya mendapat skor ${percentage}% (${grade}) dalam quiz! 🎉`,
                  url: window.location.href
                });
              }
            }}
          >
            <span className="hidden sm:inline">Bagikan</span>
            <span className="sm:hidden">Share</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Leaderboard Modal */}
      <Leaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        currentScore={{ percentage, timeSpent }}
        viewOnly={true}
        playerName={playerName}
      />

      {/* Stats Dashboard */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0 }}
        className="mt-6 md:mt-8"
      >
        <div className="px-2 md:px-0">
          <StatsDashboard />
        </div>
      </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default QuizResults;
