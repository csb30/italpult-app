import { NextResponse, NextRequest } from 'next/server';
import { createHash } from 'crypto';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const validUser = process.env.LOGIN_USERNAME;
  const validPass = process.env.LOGIN_PASSWORD;

  if (username === validUser && password === validPass) {
    const res = NextResponse.json({ success: true });
    // Set a simple session cookie (for demo only, use JWT or secure session in production)
    res.cookies.set('session', createHash('sha256').update(password).digest('hex'), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return res;
  }
  return NextResponse.json({ success: false }, { status: 401 });
}