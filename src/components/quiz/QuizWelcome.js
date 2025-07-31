'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Clock, Target, Brain, Trophy, BarChart3, User, Eye } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PancasilaQuote from '../ui/PancasilaQuote';
import StatsDashboard from '../ui/StatsDashboard';

const QuizWelcome = ({ onStartQuiz, totalQuestions, hasCompletedQuiz, onReviewAnswers, storedResult }) => {
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      title: "Materi Pancasila",
      description: "Pertanyaan seputar nilai-nilai Pancasila dan kebangsaan"
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
      title: "Tingkatkan Wawasan",
      description: "Perkuat pemahaman tentang ideologi bangsa"
    }
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  // Mobile-specific variants for smaller movements
  const mobileItemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  // Choose appropriate variants based on device
  const currentItemVariants = isMobile ? mobileItemVariants : itemVariants;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: isMobile ? 0.3 : 0.4,
        staggerChildren: isMobile ? 0.06 : 0.08
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-12 overflow-x-hidden"
    >
      {/* Hero Section */}
      <motion.div variants={currentItemVariants} className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-surface-container rounded-3xl mb-8 shadow-lg">
          <Brain size={48} className="text-on-surface" />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-on-surface leading-tight">
            <span className="block">edufrl.</span>
            <span className="block text-on-surface/70">Quiz Pancasila</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Uji pemahaman Anda tentang nilai-nilai Pancasila dengan {totalQuestions} pertanyaan pilihan berganda yang dipilih secara acak dari 40 soal yang mencakup 
            filosofi, implementasi, dan pengamalan Pancasila dalam kehidupan berbangsa dan bernegara.
          </p>
        </div>

        <div className="inline-flex items-center justify-center gap-8 text-sm text-on-surface-variant bg-surface-container/50 rounded-2xl py-4 px-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-on-surface rounded-full"></div>
            <span>{totalQuestions} dari 40 Soal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-on-surface/70 rounded-full"></div>
            <span>Urutan Acak</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-on-surface/50 rounded-full"></div>
            <span>Tanpa Batas Waktu</span>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        variants={currentItemVariants}
        className="grid md:grid-cols-2 gap-6"
      >
        {features.map((feature, index) => (
          <Card 
            key={index}
            className="p-6 hover:bg-surface-container-high transition-all duration-300 border-outline/30"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-surface-container rounded-xl text-on-surface flex-shrink-0">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-on-surface">
                  {feature.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Previous Quiz Result */}
      {hasCompletedQuiz && storedResult && (
        <motion.div variants={currentItemVariants}>
          <Card className="p-8 bg-warning-container/20 border-warning/30">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-warning">
                <Clock size={24} />
                <h3 className="text-2xl font-bold">Quiz Sudah Diselesaikan</h3>
              </div>
              
              <div className="bg-surface-container/50 rounded-xl p-6 space-y-3">
                <div className="text-lg text-on-surface">
                  <strong>Hasil Terakhir:</strong>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-on-surface">{storedResult.score}</div>
                    <div className="text-sm text-on-surface-variant">Skor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-on-surface">
                      {storedResult.correctCount}/{storedResult.totalQuestions}
                    </div>
                    <div className="text-sm text-on-surface-variant">Benar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-on-surface">
                      {Math.round((storedResult.correctCount / storedResult.totalQuestions) * 100)}%
                    </div>
                    <div className="text-sm text-on-surface-variant">Akurasi</div>
                  </div>
                </div>
                
                {storedResult.playerName && (
                  <div className="text-center pt-2 border-t border-outline/20">
                    <div className="text-sm text-on-surface-variant">Dikerjakan oleh:</div>
                    <div className="font-semibold text-on-surface">{storedResult.playerName}</div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-on-surface-variant">
                  Anda sudah menyelesaikan quiz ini. Anda dapat melihat jawaban-jawaban sebelumnya.
                </p>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onReviewAnswers}
                  icon={<Eye size={20} />}
                  className="px-8 py-3 text-warning border-warning hover:bg-warning/10 rounded-xl"
                >
                  Lihat Jawaban Sebelumnya
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quiz Categories Preview */}
      <motion.div variants={currentItemVariants}>
        <Card className="p-8 bg-surface-container/30 border-outline/20">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-on-surface">
              Kategori Quiz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-container p-6 rounded-xl border border-outline/20 hover:bg-surface-container-high transition-colors">
                <div className="text-on-surface font-semibold mb-2">Filosofi Pancasila</div>
                <div className="text-sm text-on-surface-variant">Sejarah, makna, dan filosofi Pancasila</div>
              </div>
              <div className="bg-surface-container p-6 rounded-xl border border-outline/20 hover:bg-surface-container-high transition-colors">
                <div className="text-on-surface font-semibold mb-2">Nilai-Nilai Sila Pancasila</div>
                <div className="text-sm text-on-surface-variant">Pemahaman mendalam setiap sila</div>
              </div>
              <div className="bg-surface-container p-6 rounded-xl border border-outline/20 hover:bg-surface-container-high transition-colors">
                <div className="text-on-surface font-semibold mb-2">Pengamalan Pancasila</div>
                <div className="text-sm text-on-surface-variant">Implementasi dalam kehidupan sehari-hari</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Start Quiz Section - Only show if quiz not completed */}
      {!hasCompletedQuiz && (
        <motion.div 
          variants={currentItemVariants}
          className="text-center mb-8 space-y-6"
        >
          {showNameInput && (
            <motion.div
              initial={{ opacity: 0, y: isMobile ? -10 : -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.2 : 0.3, ease: "easeOut" }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full pl-10 pr-4 py-4 bg-surface-container border border-outline/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-on-surface/20 focus:border-on-surface/30 text-on-surface placeholder:text-on-surface-variant transition-all"
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
            className="px-16 py-4 text-lg font-semibold bg-on-surface text-surface hover:bg-on-surface/90 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={showNameInput && !playerName.trim()}
          >
            {showNameInput ? 'Mulai Quiz' : 'Mulai Quiz'}
          </Button>
          
          {showNameInput && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: isMobile ? 0.2 : 0.3, delay: 0.1 }}
              className="text-sm text-on-surface-variant bg-surface-container/50 rounded-xl py-2 px-4 inline-block"
            >
              Nama akan ditampilkan di leaderboard
            </motion.p>
          )}
        </motion.div>
      )}

      {/* API Integration Section */}
      <motion.div variants={currentItemVariants} className="space-y-12">
        {/* Programming Quote */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-center text-on-surface">
            Wisdom
          </h3>
          <PancasilaQuote />
        </div>

        {/* Stats Dashboard */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-center text-on-surface">
            Platform Statistics
          </h3>
          <StatsDashboard />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizWelcome;
