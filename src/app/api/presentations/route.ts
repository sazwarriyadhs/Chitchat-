import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const senderId = searchParams.get('senderId');

  if (!senderId) {
    return NextResponse.json({ error: 'senderId is required' }, { status: 400 });
  }

  try {
    // Assuming sender_id in your presentations table is of a type compatible with the string from senderId
    const result = await pool.query('SELECT * FROM presentations WHERE sender_id = $1 ORDER BY uploaded_at DESC', [senderId]);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Failed to fetch presentations from database.', details: error.message }, { status: 500 });
  }
}
