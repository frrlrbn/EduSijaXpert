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
    const { score, timeSpent, category = 'Programming Quiz', type, data } = await request.json();
    
    // Extract data from nested structure if needed
    const actualScore = data?.score || score;
    const actualTimeSpent = data?.timeSpent || timeSpent;
    const actualCategory = data?.category || category;
    
    if (typeof actualScore !== 'number' || actualScore < 0 || actualScore > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid score provided' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Check if stats table exists and has data
    const [existingStats] = await connection.execute(
      'SELECT id FROM quiz_stats WHERE id = 1'
    );
    
    if (existingStats.length === 0) {
      // Initialize stats table if empty
      await connection.execute(`
        INSERT INTO quiz_stats (id, total_quizzes, total_users, average_score, category_performance) 
        VALUES (1, 0, 0, 0, '{"Programming Quiz": 0, "Web Development": 0, "JavaScript": 0}')
      `);
    }
    
    // Update quiz statistics
    await connection.execute(`
      UPDATE quiz_stats 
      SET total_quizzes = (SELECT COUNT(*) FROM leaderboard),
          total_users = (SELECT COUNT(DISTINCT name) FROM leaderboard),
          average_score = (SELECT COALESCE(AVG(score), 0) FROM leaderboard)
      WHERE id = 1
    `);
    
    // Update category performance if needed
    if (actualCategory) {
      const [categoryStats] = await connection.execute(
        'SELECT category_performance FROM quiz_stats WHERE id = 1'
      );
      
      if (categoryStats.length > 0) {
        let categoryPerformance;
        try {
          categoryPerformance = JSON.parse(categoryStats[0].category_performance || '{}');
        } catch (e) {
          categoryPerformance = {};
        }
        
        // Calculate average score for this category
        const [categoryAvg] = await connection.execute(
          'SELECT COALESCE(AVG(score), 0) as avg_score FROM leaderboard WHERE category = ?',
          [actualCategory]
        );
        
        categoryPerformance[actualCategory] = Math.round(categoryAvg[0].avg_score);
        
        await connection.execute(
          'UPDATE quiz_stats SET category_performance = ? WHERE id = 1',
          [JSON.stringify(categoryPerformance)]
        );
      }
    }
    
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
