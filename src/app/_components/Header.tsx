"use client";

import { useAuth } from "@/app/_hooks/useAuth";
import NextLink from "next/link";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";

export const Header: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const router = useRouter();

  const handleDeleteAccount = useCallback(async () => {
    const confirmed = window.confirm("本当に退会しますか？この操作は取り消せません。");
    if (!confirmed) return;

    const res = await fetch("/api/account", {
      method: "DELETE",
      credentials: "same-origin",
    });

    if (!res.ok) {
      window.alert("退会に失敗しました。もう一度お試しください。");
      return;
    }

    await logout();
    router.push("/");
  }, [logout, router]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
        <NextLink
          href="/"
          className="flex items-center gap-3 text-lg font-bold text-slate-900 transition hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-50"
        >
          <FontAwesomeIcon icon={faChalkboardUser} className="text-indigo-500" />
          <span>WebSecPlayground</span>
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400">セッション認証</span>
        </NextLink>

        <div className="flex items-center gap-2 text-sm">
          {userProfile ? (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <span>{userProfile.name}</span>
              <button
                type="button"
                className="rounded-full px-3 py-1 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={logout}
              >
                ログアウト
              </button>
              <button
                type="button"
                className="rounded-full bg-rose-500 px-3 py-1 text-white transition hover:bg-rose-600"
                onClick={handleDeleteAccount}
              >
                退会
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => router.push("/login")}
            >
              ログイン
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
