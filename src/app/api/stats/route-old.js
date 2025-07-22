import { NextResponse } from 'next/server';

// In-memory storage for stats (in production, use a database)
let stats = {
  totalQuizzesTaken: 1247,
  totalUsers: 423,
  averageScore: 76.8,
  questionsAnswered: 31175,
  correctAnswers: 23856,
  categoryStats: {
    'web-basics': { attempts: 485, averageScore: 78.5 },
    'programming': { attempts: 392, averageScore: 74.2 },
    'it-general': { attempts: 370, averageScore: 77.8 }
  },
  recentActivity: [
    { action: 'quiz_completed', score: 88, time: Date.now() - 1000 * 60 * 5 },
    { action: 'quiz_completed', score: 92, time: Date.now() - 1000 * 60 * 15 },
    { action: 'quiz_completed', score: 76, time: Date.now() - 1000 * 60 * 32 },
    { action: 'quiz_completed', score: 84, time: Date.now() - 1000 * 60 * 48 },
    { action: 'quiz_completed', score: 90, time: Date.now() - 1000 * 60 * 67 }
  ]
};

export async function GET() {
  try {
    // Calculate accuracy rate
    const accuracyRate = stats.questionsAnswered > 0 
      ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) 
      : 0;

    // Calculate growth metrics (simulated)
    const weeklyGrowth = {
      quizzes: Math.floor(Math.random() * 50) + 20, // 20-70 new quizzes this week
      users: Math.floor(Math.random() * 15) + 5,    // 5-20 new users this week
      engagement: Math.floor(Math.random() * 20) + 80 // 80-100% engagement rate
    };

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalQuizzesTaken: stats.totalQuizzesTaken,
          totalUsers: stats.totalUsers,
          averageScore: stats.averageScore,
          accuracyRate: accuracyRate,
          questionsAnswered: stats.questionsAnswered
        },
        categories: stats.categoryStats,
        growth: weeklyGrowth,
        recentActivity: stats.recentActivity.map(activity => ({
          ...activity,
          timeAgo: formatTimeAgo(activity.time)
        })),
        insights: generateInsights()
      },
      message: 'Statistics retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve statistics' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    switch (type) {
      case 'quiz_completed':
        const { score, category, correctAnswers, totalQuestions, timeSpent } = data;
        
        // Update global stats
        stats.totalQuizzesTaken += 1;
        stats.questionsAnswered += totalQuestions;
        stats.correctAnswers += correctAnswers;
        stats.averageScore = Math.round(
          ((stats.averageScore * (stats.totalQuizzesTaken - 1)) + score) / stats.totalQuizzesTaken * 10
        ) / 10;

        // Update category stats
        if (category && stats.categoryStats[category]) {
          const categoryData = stats.categoryStats[category];
          categoryData.attempts += 1;
          categoryData.averageScore = Math.round(
            ((categoryData.averageScore * (categoryData.attempts - 1)) + score) / categoryData.attempts * 10
          ) / 10;
        }

        // Add to recent activity
        stats.recentActivity.unshift({
          action: 'quiz_completed',
          score: score,
          time: Date.now(),
          category: category
        });

        // Keep only last 10 activities
        stats.recentActivity = stats.recentActivity.slice(0, 10);

        return NextResponse.json({
          success: true,
          message: 'Statistics updated successfully',
          data: { newRank: calculateRank(score) }
        });

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid statistics type' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update statistics' },
      { status: 500 }
    );
  }
}

function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function calculateRank(score) {
  if (score >= 95) return 'Expert';
  if (score >= 85) return 'Advanced';
  if (score >= 75) return 'Intermediate';
  if (score >= 60) return 'Beginner';
  return 'Novice';
}

function generateInsights() {
  const insights = [
    "Web Basics questions have the highest success rate",
    "Most users complete quizzes in under 10 minutes", 
    "Programming fundamentals show steady improvement trends",
    "Evening hours show peak quiz activity",
    "Mobile users represent 60% of total participants"
  ];

  return insights.slice(0, 3); // Return 3 random insights
}
