import crypto from 'crypto';

const SESSION_SECRET = process.env.JWT_SECRET || 'baobab_secret_key_tailoring_2026_saas_app_atelier';
const SESSION_COOKIE_NAME = 'atelier_session';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedValue) {
  if (!storedValue || !storedValue.includes(':')) return false;
  const [salt, hash] = storedValue.split(':');
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === checkHash;
}

export function createSessionToken(userId) {
  const payload = {
    userId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const bodyBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(bodyBase64)
    .digest('hex');
  
  return `${bodyBase64}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes('.')) return null;
  const [bodyBase64, signature] = token.split('.');
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(bodyBase64)
    .digest('hex');
    
  if (signature !== expectedSignature) return null;
  
  try {
    const payload = JSON.parse(Buffer.from(bodyBase64, 'base64').toString('utf8'));
    if (payload.exp < Date.now()) return null; // Expired
    return payload.userId;
  } catch (e) {
    return null;
  }
}

export function getUserSession(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const parts = c.split('=');
    if (parts.length === 2) {
      cookies[parts[0].trim()] = parts[1].trim();
    }
  });
  
  const token = cookies[SESSION_COOKIE_NAME];
  return verifySessionToken(token);
}

export function getSessionCookieString(token, clear = false) {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';
  if (clear) {
    return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
  }
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${secureFlag}`;
}
