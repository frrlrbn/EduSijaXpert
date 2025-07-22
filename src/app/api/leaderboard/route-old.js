import { NextResponse } from 'next/server';

// In-memory storage (in production, use a database)
let leaderboard = [
  { id: 1, name: 'Alex Chen', score: 95, time: 480, date: '2025-01-20' },
  { id: 2, name: 'Sarah Johnson', score: 92, time: 520, date: '2025-01-19' },
  { id: 3, name: 'Mike Rodriguez', score: 88, time: 445, date: '2025-01-18' },
  { id: 4, name: 'Emily Wang', score: 85, time: 600, date: '2025-01-17' },
  { id: 5, name: 'David Kim', score: 82, time: 580, date: '2025-01-16' }
];

export async function GET() {
  try {
    // Sort by score (descending), then by time (ascending) for tie-breaking
    const sortedLeaderboard = leaderboard
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
      })
      .slice(0, 10); // Top 10

    return NextResponse.json({
      success: true,
      data: sortedLeaderboard,
      message: 'Leaderboard retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, score, time } = await request.json();

    // Validation
    if (!name || typeof score !== 'number' || typeof time !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Invalid data provided' },
        { status: 400 }
      );
    }

    if (score < 0 || score > 100) {
      return NextResponse.json(
        { success: false, message: 'Score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Add new entry
    const newEntry = {
      id: Date.now(),
      name: name.trim().substring(0, 50), // Limit name length
      score,
      time,
      date: new Date().toISOString().split('T')[0]
    };

    leaderboard.push(newEntry);

    // Keep only top 100 entries to prevent memory issues
    leaderboard = leaderboard
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
      })
      .slice(0, 100);

    return NextResponse.json({
      success: true,
      data: newEntry,
      message: 'Score submitted successfully',
      rank: leaderboard.findIndex(entry => entry.id === newEntry.id) + 1
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to submit score' },
      { status: 500 }
    );
  }
}
