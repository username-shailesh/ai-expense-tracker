/**
 * JWT Utilities
 * Handles JWT token creation, verification, and payload management
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Mock JWT implementation (for demonstration)
 * In production, use a real JWT library like 'jsonwebtoken'
 * This is intentionally simple for educational purposes
 */

export function createToken(userId: string, email: string): string {
  // Create a simple base64 encoded token with payload
  // In production, use: jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' })
  const payload = JSON.stringify({
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  });
  return Buffer.from(payload).toString('base64');
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    // In production, use: jwt.verify(token, JWT_SECRET)
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  return null;
}
