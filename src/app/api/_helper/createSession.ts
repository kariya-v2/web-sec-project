import { cookies } from "next/headers";
import { prisma } from "@/libs/prisma";
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from "@/app/api/_helper/sessionCookie";

/**
 * セッションを新規作成して Cookie に設定する。
 * @param userId - ユーザのID (UUID)
 * @param tokenMaxAgeSeconds - 有効期限（秒単位）
 * @returns - SessionID
 */
export const createSession = async (
  userId: string,
  tokenMaxAgeSeconds: number,
): Promise<string> => {
  // 💀 当該ユーザのセッションが既にDBに存在するなら消す処理を入れるべき
  // await prisma.session.deleteMany({ where: { userId: user.id } });
  // 👆 ただし、これだと全ての端末のセッションが無効になる ✍ どうすればよいか考えてみよう。
  const session = await prisma.session.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      expiresAt: new Date(Date.now() + tokenMaxAgeSeconds * 1000),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session.id, {
    ...getSessionCookieOptions(tokenMaxAgeSeconds),
  });

  return session.id;
};
