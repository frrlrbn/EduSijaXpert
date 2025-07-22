import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

// GET /api/stats - Get platform statistics
export async function GET() {
  try {
    const connection = await getConnection();
    
    // Get general stats
    const [statsRows] = await connection.execute(
      'SELECT total_quizzes, total_users, average_score, category_performance FROM quiz_stats WHERE id = 1'
    );
    
    const stats = statsRows[0] || {
      total_quizzes: 0,
      total_users: 0,
      average_score: 0,
      category_performance: '{"Web Development": 0, "JavaScript": 0, "HTML/CSS": 0}'
    };
    
    // Get recent activity (last 5 submissions)
    const [recentRows] = await connection.execute(
      'SELECT name, score, category, created_at FROM leaderboard ORDER BY created_at DESC LIMIT 5'
    );
    
    // Parse category performance JSON
    let categoryPerformance;
    try {
      categoryPerformance = typeof stats.category_performance === 'string' 
        ? JSON.parse(stats.category_performance)
        : stats.category_performance;
    } catch (e) {
      categoryPerformance = { "Web Development": 0, "JavaScript": 0, "HTML/CSS": 0 };
    }
    
    return NextResponse.json({
      success: true,
      totalQuizzes: stats.total_quizzes,
      averageScore: parseFloat(stats.average_score),
      totalUsers: stats.total_users,
      categoryPerformance,
      recentActivity: recentRows.map(row => ({
        name: row.name,
        score: row.score,
        category: row.category,
        timestamp: row.created_at
      })),
      insights: [
        `Total ${stats.total_quizzes} quizzes completed`,
        `Average score: ${parseFloat(stats.average_score).toFixed(1)}%`,
        `${stats.total_users} unique participants`
      ]
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

// POST /api/stats - Update statistics (called after quiz completion)
export async function POST(request) {
  try {
    const { score, timeSpent, category = 'General' } = await request.json();
    
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid score provided' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // This will be handled by the leaderboard API when a score is submitted
    // Just return success for now
    return NextResponse.json({
      success: true,
      message: 'Statistics updated successfully'
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update statistics' },
      { status: 500 }
    );
  }
}
