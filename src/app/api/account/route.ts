import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { verifySession } from "@/app/api/_helper/verifySession";
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from "@/app/api/_helper/sessionCookie";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const DELETE = async () => {
  try {
    const userId = await verifySession();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          payload: null,
          message: "認証が必要です。",
        },
        { status: 401 },
      );
    }

    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, "", {
      ...getSessionCookieOptions(0),
    });

    return NextResponse.json({
      success: true,
      payload: null,
      message: "アカウントを削除しました。",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        payload: null,
        message: "アカウント削除に失敗しました。",
      },
      { status: 500 },
    );
  }
};
