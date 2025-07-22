import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

// GET /api/leaderboard - Get top scores
export async function GET() {
  try {
    const connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT id, name, score, time_spent as timeSpent, created_at as timestamp FROM leaderboard ORDER BY score DESC, time_spent ASC LIMIT 10'
    );
    
    return NextResponse.json({
      success: true,
      leaderboard: rows
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

// POST /api/leaderboard - Submit new score
export async function POST(request) {
  try {
    const { name, score, timeSpent, category = 'General' } = await request.json();
    
    // Validation
    if (!name || typeof score !== 'number' || typeof timeSpent !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided' },
        { status: 400 }
      );
    }
    
    if (score < 0 || score > 100) {
      return NextResponse.json(
        { success: false, error: 'Score must be between 0 and 100' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Insert new score
    const [result] = await connection.execute(
      'INSERT INTO leaderboard (name, score, time_spent, category) VALUES (?, ?, ?, ?)',
      [name.trim(), score, timeSpent, category]
    );
    
    // Update stats
    await connection.execute(`
      UPDATE quiz_stats 
      SET total_quizzes = total_quizzes + 1,
          total_users = (SELECT COUNT(DISTINCT name) FROM leaderboard),
          average_score = (SELECT AVG(score) FROM leaderboard)
      WHERE id = 1
    `);
    
    // Get updated leaderboard
    const [rows] = await connection.execute(
      'SELECT id, name, score, time_spent as timeSpent, created_at as timestamp FROM leaderboard ORDER BY score DESC, time_spent ASC LIMIT 10'
    );
    
    return NextResponse.json({
      success: true,
      message: 'Score submitted successfully',
      leaderboard: rows,
      submittedScore: {
        id: result.insertId,
        name: name.trim(),
        score,
        timeSpent,
        category
      }
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}
