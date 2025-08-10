import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID!;
const twilioApiKey = process.env.TWILIO_API_KEY_SID!;
const twilioApiSecret = process.env.TWilio_API_KEY_SECRET!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identity = searchParams.get('identity') || 'user-' + Math.floor(Math.random() * 1000);
  const roomName = searchParams.get('room') || 'test-room';

  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { identity });

  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);

  return NextResponse.json({ token: token.toJwt(), identity, roomName });
}
