import { cookies } from 'next/headers';

const SECRET = process.env.ADMIN_SECRET || 'dental-cosmetics-secret-key-12345';
const COOKIE_NAME = 'admin-session';
const SESSION_TIMEOUT_MS = 1000 * 60 * 30; // 30 minutes

async function getCryptoKey() {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function signSession(username: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_TIMEOUT_MS;
  const payload = JSON.stringify({ username, expiresAt });
  
  const key = await getCryptoKey();
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  
  const signatureBase64 = arrayBufferToBase64(signatureBuffer).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadBase64 = btoa(payload).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  return `${payloadBase64}.${signatureBase64}`;
}

export async function verifySession(token: string): Promise<{ username: string } | null> {
  try {
    const [payloadBase64Url, signatureBase64Url] = token.split('.');
    if (!payloadBase64Url || !signatureBase64Url) return null;
    
    // Add padding back if necessary
    const pad = (str: string) => str + '='.repeat((4 - str.length % 4) % 4);
    const payloadBase64 = pad(payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/'));
    const signatureBase64 = pad(signatureBase64Url.replace(/-/g, '+').replace(/_/g, '/'));

    const payload = atob(payloadBase64);
    const key = await getCryptoKey();
    const enc = new TextEncoder();
    
    const signatureBuffer = base64ToArrayBuffer(signatureBase64);
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBuffer, enc.encode(payload));
    
    if (!isValid) return null;
    
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
  return await verifySession(token);
}

export async function setSessionCookie(username: string) {
  const token = await signSession(username);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 30, // 30 minutes in seconds
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
