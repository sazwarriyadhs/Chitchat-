import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const senderId = searchParams.get('senderId');

  if (!senderId) {
    return NextResponse.json({ error: 'senderId is required' }, { status: 400 });
  }

  try {
    const result = await pool.query('SELECT * FROM presentations WHERE sender_id = $1 ORDER BY uploaded_at DESC', [senderId]);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
