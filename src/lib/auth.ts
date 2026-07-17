import crypto from 'crypto';
import { cookies } from 'next/headers';

const SECRET = process.env.ADMIN_SECRET || 'dental-cosmetics-secret-key-12345';
const COOKIE_NAME = 'admin-session';

export function signSession(username: string): string {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  const payload = JSON.stringify({ username, expiresAt });
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

export function verifySession(token: string): { username: string } | null {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;
    const payload = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    if (signature !== expectedSignature) return null;
    const data = JSON.parse(payload);
    if (Date.now() > data.expiresAt) return null;
    return { username: data.username };
  } catch (err) {
    return null;
  }
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function setSessionCookie(username: string) {
  const token = signSession(username);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
