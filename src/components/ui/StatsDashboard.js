'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Target, TrendingUp, Clock, Brain, Award, Trophy } from 'lucide-react';
import Card from '../ui/Card';

const StatsCard = ({ icon, title, value, subtitle, trend, color = 'primary' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="h-full"
  >
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-${color}-container`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
        <p className="text-sm text-on-surface-variant">{title}</p>
        {subtitle && (
          <p className="text-xs text-on-surface-variant mt-1">{subtitle}</p>
        )}
      </div>
    </Card>
  </motion.div>
);

const StatsDashboard = ({ className = '' }) => {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard.slice(0, 5)); // Top 5 for dashboard
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data);
      } else {
        setError(data.error || 'Failed to load statistics');
      }
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-on-surface-variant mt-2">Loading statistics...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-on-surface">Platform Statistics</h3>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          icon={<Users className="text-primary" size={20} />}
          title="Total Users"
          value={stats.totalUsers?.toLocaleString() || '0'}
          subtitle="Registered players"
          color="primary"
        />
        
        <StatsCard
          icon={<Brain className="text-secondary" size={20} />}
          title="Quizzes Taken"
          value={stats.totalQuizzes?.toLocaleString() || '0'}
          subtitle="Total attempts"
          color="secondary"
        />
        
        <StatsCard
          icon={<Target className="text-tertiary" size={20} />}
          title="Average Score"
          value={`${Math.round(stats.averageScore || 0)}%`}
          subtitle="Platform average"
          trend={5}
          color="tertiary"
        />
        
        <StatsCard
          icon={<Award className="text-warning" size={20} />}
          title="Active Players"
          value={stats.totalUsers?.toLocaleString() || '0'}
          subtitle="All time"
          trend={12}
          color="warning"
        />
      </div>

      {/* Category Performance */}
      <Card className="p-6 mb-6">
        <h4 className="text-lg font-semibold text-on-surface mb-4">Category Performance</h4>
        <div className="space-y-4">
          {stats.categoryPerformance && Object.entries(stats.categoryPerformance).map(([categoryName, score]) => {
            return (
              <div key={categoryName} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface font-medium">
                    {categoryName}
                  </span>
                  <div className="text-right">
                    <span className="text-on-surface font-semibold">
                      {Math.round(score)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-primary h-2 rounded-full"
                  />
                </div>
              </div>
            );
          })}
          
          {(!stats.categoryPerformance || Object.keys(stats.categoryPerformance).length === 0) && (
            <div className="text-center py-4 text-on-surface-variant">
              No category data yet
            </div>
          )}
        </div>
      </Card>

      {/* Leaderboard & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Players */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
            <Trophy size={20} />
            Top Players
          </h4>
          <div className="space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-surface-container rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-surface-container-high text-on-surface'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-on-surface text-sm font-medium">
                      {player.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-on-surface font-semibold">
                      {player.score}%
                    </span>
                    <p className="text-on-surface-variant text-xs">
                      {Math.floor(player.timeSpent / 60)}m {player.timeSpent % 60}s
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-4 text-on-surface-variant">
                No scores yet. Be the first!
              </div>
            )}
          </div>
        </Card>

        {/* Insights */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Insights
          </h4>
          <div className="space-y-3">
            {stats.insights && stats.insights.length > 0 ? (
              stats.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-3 p-3 bg-primary-container rounded-lg"
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span className="text-on-primary-container text-sm">
                    {insight}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-4 text-on-surface-variant">
                <div className="flex items-start gap-3 p-3 bg-primary-container rounded-lg">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span className="text-on-primary-container text-sm">
                    Complete quizzes to see insights
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StatsDashboard;
