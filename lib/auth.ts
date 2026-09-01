import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "portfolio_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin12345";
const DEFAULT_ADMIN_SECRET = "development-secret-123456";

function getSecret() {
  const secret = process.env.ADMIN_SECRET || DEFAULT_ADMIN_SECRET;
  return secret.length >= 16 ? secret : DEFAULT_ADMIN_SECRET;
}

function sign(payload: string): string {
  const secret = getSecret();
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verify(token: string): string | null {
  try {
    const secret = getSecret();
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return null;
    const payload = token.slice(0, lastDot);
    const sig = token.slice(lastDot + 1);
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp && Date.now() > data.exp) return null;
    return data.user as string;
  } catch {
    return null;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  const adminUser = (process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME).trim();
  const adminPass = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  try {
    const uOk =
      username.length === adminUser.length &&
      timingSafeEqual(Buffer.from(username), Buffer.from(adminUser));
    const pOk =
      password.length === adminPass.length &&
      timingSafeEqual(Buffer.from(password), Buffer.from(adminPass));
    return uOk && pOk;
  } catch {
    return false;
  }
}

export async function createSession(username: string) {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ user: username, exp })).toString(
    "base64url"
  );
  const token = sign(payload);
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<string | null> {
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verify(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<string> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
