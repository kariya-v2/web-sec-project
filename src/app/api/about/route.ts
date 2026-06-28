import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json(
    { success: false, payload: null, message: "このエンドポイントは廃止されました。" },
    { status: 404 },
  );
};
