'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Clock, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const Leaderboard = ({ isOpen, onClose, currentScore = null, viewOnly = false, playerName = '' }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard);
      } else {
        setError(data.error || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const submitScore = async () => {
    if (!playerNameInput.trim() || !currentScore) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerNameInput.trim(),
          score: currentScore.percentage,
          timeSpent: currentScore.timeSpent,
          category: 'Programming Quiz'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowSubmitForm(false);
        setPlayerNameInput('');
        setLeaderboard(data.leaderboard); // Use returned leaderboard
        
        // Show success notification
        alert(`🎉 Score submitted successfully! Check your position on the leaderboard!`);
      } else {
        setError(data.error || 'Failed to submit score');
      }
    } catch (err) {
      setError('Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="text-yellow-500" size={20} />;
      case 1: return <Medal className="text-gray-400" size={20} />;
      case 2: return <Award className="text-orange-500" size={20} />;
      default: return <span className="text-on-surface-variant font-bold">{index + 1}</span>;
    }
  };

  const formatTime = (seconds) => {
    // Handle invalid or undefined values
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return '0:00';
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Unknown date';
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl my-8 mx-auto"
      >
        <Card className="p-4 md:p-6 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between mb-4 md:mb-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-500 w-6 h-6 md:w-7 md:h-7" />
              <h2 className="text-xl md:text-2xl font-bold text-on-surface">Leaderboard</h2>
            </div>
            <Button
              variant="text"
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface p-1"
            >
              ✕
            </Button>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto space-y-4 md:space-y-6 pr-2 -mr-2">

          {/* Current Score Display (viewOnly) */}
          {viewOnly && currentScore && playerName && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-primary-container rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-on-primary-container font-semibold">
                    {playerName}'s Score: {currentScore.percentage}%
                  </p>
                  <p className="text-on-primary-container text-sm opacity-75">
                    Time: {formatTime(currentScore.timeSpent)} • Score submitted ✓
                  </p>
                </div>
                <div className="text-green-500">
                  <Trophy size={24} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Score Section - Only for non-viewOnly mode */}
          {!viewOnly && currentScore && !showSubmitForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-primary-container rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-on-primary-container font-semibold">
                    Your Score: {currentScore.percentage}%
                  </p>
                  <p className="text-on-primary-container text-sm opacity-75">
                    Time: {formatTime(currentScore.timeSpent)}
                  </p>
                </div>
                <Button
                  variant="filled"
                  onClick={() => setShowSubmitForm(true)}
                  className="flex items-center gap-2"
                >
                  <TrendingUp size={16} />
                  Submit to Leaderboard
                </Button>
              </div>
            </motion.div>
          )}

          {/* Submit Form */}
          {!viewOnly && showSubmitForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-surface-container rounded-lg"
            >
              <h3 className="font-semibold mb-3 text-on-surface">Enter Your Name</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  placeholder="Your name..."
                  className="flex-1 px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary"
                  maxLength={50}
                  onKeyPress={(e) => e.key === 'Enter' && submitScore()}
                />
                <Button
                  variant="filled"
                  onClick={submitScore}
                  disabled={!playerNameInput.trim() || submitting}
                  className="px-6"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg">
              {error}
            </div>
          )}

          {/* Leaderboard List */}
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="text-center py-8 text-on-surface-variant">
                Loading leaderboard...
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      index < 3 
                        ? 'bg-primary-container text-on-primary-container' 
                        : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 flex justify-center">
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <p className="font-semibold">{entry.name}</p>
                        <p className="text-sm opacity-75">{formatDate(entry.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.score}%</p>
                      <div className="flex items-center gap-1 text-sm opacity-75">
                        <Clock size={12} />
                        {formatTime(entry.timeSpent)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-on-surface-variant">
                No scores yet. Be the first to submit!
              </div>
            )}
          </div>
          </div>

          {/* Fixed bottom section */}
          <div className="mt-4 md:mt-6 pt-4 border-t border-outline flex-shrink-0">
            <Button
              variant="outlined"
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
