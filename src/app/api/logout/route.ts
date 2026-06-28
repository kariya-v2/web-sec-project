import { prisma } from "@/libs/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from "@/app/api/_helper/sessionCookie";

// キャッシュ無効化設定（login と揃える）
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const DELETE = async () => {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionId) {
      await prisma.session.deleteMany({
        where: { id: sessionId },
      });

      // クッキー削除（上書きで maxAge 0 を指定）
      cookieStore.set(SESSION_COOKIE_NAME, "", {
        ...getSessionCookieOptions(0),
      });
    }

    const res: ApiResponse<null> = {
      success: true,
      payload: null,
      message: "ログアウトしました。",
    };
    return NextResponse.json(res);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Internal Server Error";
    console.error(errorMsg);

    const res: ApiResponse<null> = {
      success: false,
      payload: null,
      message: "ログアウトのサーバ処理でエラーが発生しました。",
    };
    return NextResponse.json(res);
  }
};
