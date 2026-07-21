import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionData = {
  userId?: string;
};

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "dev-only-not-secure-min-32-chars-000",
  cookieName: "cnrflex-panel-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireSession() {
  const session = await getSession();
  if (!session.userId) redirect("/login");
  return session;
}
