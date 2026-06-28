export const SESSION_COOKIE_NAME = "session_id";

export const getSessionCookieOptions = (maxAge: number) => ({
  path: "/" as const,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge,
});
