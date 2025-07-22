'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Clock, Target, Brain, Trophy, BarChart3, User } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgrammingQuote from '../ui/ProgrammingQuote';
import StatsDashboard from '../ui/StatsDashboard';

const QuizWelcome = ({ onStartQuiz, totalQuestions }) => {
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleStartClick = () => {
    if (!showNameInput) {
      setShowNameInput(true);
    } else if (playerName.trim()) {
      onStartQuiz(playerName.trim());
    }
  };

  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Materi Komprehensif",
      description: "Pertanyaan seputar web development dan programming"
    },
    {
      icon: <Clock size={24} />,
      title: "Tanpa Batas Waktu",
      description: "Kerjakan dengan santai, fokus pada pemahaman"
    },
    {
      icon: <Target size={24} />,
      title: "Feedback Instan",
      description: "Dapatkan penjelasan untuk setiap jawaban"
    },
    {
      icon: <Brain size={24} />,
      title: "Tingkatkan Skill",
      description: "Asah kemampuan programming Anda"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-12"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-6">
          <Brain size={40} className="text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Programming Quiz
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Uji pengetahuan programming Anda dengan {totalQuestions} pertanyaan yang dirancang untuk 
            mengasah kemampuan web development dan coding.
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary" />
            <span>{totalQuestions} Pertanyaan</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <span>Tanpa Batas Waktu</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-primary" />
            <span>Instant Feedback</span>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid md:grid-cols-2 gap-6"
      >
        {features.map((feature, index) => (
          <Card 
            key={index}
            className="p-6 hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-on-surface">
                  {feature.title}
                </h3>
                <p className="text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Quiz Categories Preview */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-on-surface mb-6">
              Kategori Quiz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-container p-4 rounded-xl">
                <div className="text-primary font-semibold mb-2">Web Development</div>
                <div className="text-sm text-on-surface-variant">HTML, CSS, Responsive Design</div>
              </div>
              <div className="bg-surface-container p-4 rounded-xl">
                <div className="text-primary font-semibold mb-2">JavaScript</div>
                <div className="text-sm text-on-surface-variant">ES6+, DOM, Functions</div>
              </div>
              <div className="bg-surface-container p-4 rounded-xl">
                <div className="text-primary font-semibold mb-2">Programming</div>
                <div className="text-sm text-on-surface-variant">Logic, Algorithms, Best Practices</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Start Quiz Section */}
      <motion.div 
        variants={itemVariants}
        className="text-center mb-8 space-y-4"
      >
        {showNameInput && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface"
                maxLength={50}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && playerName.trim()) {
                    handleStartClick();
                  }
                }}
                autoFocus
              />
            </div>
          </motion.div>
        )}
        
        <Button
          variant="filled"
          size="large"
          onClick={handleStartClick}
          icon={<Play size={20} />}
          className="px-12 py-4 text-lg font-semibold"
          disabled={showNameInput && !playerName.trim()}
        >
          {showNameInput ? 'Mulai Quiz' : 'Mulai Quiz'}
        </Button>
        
        {showNameInput && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-on-surface-variant"
          >
            Nama akan ditampilkan di leaderboard
          </motion.p>
        )}
      </motion.div>

      {/* API Integration Section */}
      <motion.div variants={itemVariants} className="space-y-8">
        {/* Programming Quote */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">💡 Programming Wisdom</h3>
          <ProgrammingQuote />
        </div>

        {/* Stats Dashboard */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">📊 Platform Statistics</h3>
          <StatsDashboard />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizWelcome;
