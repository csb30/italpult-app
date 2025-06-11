import { NextRequest } from 'next/server';
import { createHash } from 'crypto';

export function isAuthenticated(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  const loginPassword = process.env.LOGIN_PASSWORD ?? '';
  return session === createHash('sha256').update(loginPassword).digest('hex');
}