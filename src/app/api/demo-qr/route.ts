import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET() {
  const member = {
    member_id: "MBR00123",
    business_name: "Warung Kopi Asik",
    owner_name: "Budi Santoso",
  };

  try {
    const buffer = await QRCode.toBuffer(JSON.stringify(member), { width: 400 });
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
