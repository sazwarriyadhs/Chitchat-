import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const { AccessToken } = twilio.jwt;
const { VideoGrant } = AccessToken;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const identity = searchParams.get('identity');
  const room = searchParams.get('room');

  if (!identity || !room) {
    return NextResponse.json({ error: 'Missing identity or room name' }, { status: 400 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY_SID;
  const apiSecret = process.env.TWILIO_API_KEY_SECRET;

  if (!accountSid || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Twilio credentials are not configured on the server.' }, { status: 500 });
  }

  const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });

  const videoGrant = new VideoGrant({ room });
  token.addGrant(videoGrant);

  return NextResponse.json({ token: token.toJwt() });
}
