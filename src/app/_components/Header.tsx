"use client";

import { useAuth } from "@/app/_hooks/useAuth";
import NextLink from "next/link";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";

import { twMerge } from "tailwind-merge";
import { AUTH } from "@/config/auth";

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
      window.alert("退会に失敗しました。もう一度お試しください。" );
      return;
    }

    await logout();
    router.push("/");
  }, [logout, router]);

  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-3xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white",
          )}
        >
          <div>
            <NextLink href="/">
              <FontAwesomeIcon icon={faChalkboardUser} className="mr-1.5" />
              WebSecPlayground
            </NextLink>
            <span className="ml-1 text-xs font-normal">
              {AUTH.isSession ? "- Session Auth" : "- JWT Auth"}
            </span>
          </div>
          {userProfile ? (
            <div className="ml-2 text-sm text-slate-400">
              <div className="flex items-center gap-x-2">
                <div className="text-slate-200">{userProfile.name}</div>
                <div
                  className={twMerge("cursor-pointer hover:text-white")}
                  onClick={logout}
                >
                  ログアウト
                </div>
                <div
                  className={twMerge("cursor-pointer hover:text-rose-300")}
                  onClick={handleDeleteAccount}
                >
                  退会
                </div>
              </div>
            </div>
          ) : (
            <div
              className={twMerge(
                "ml-2 text-sm text-slate-400",
                "cursor-pointer hover:text-white",
              )}
              onClick={() => {
                router.push("/login");
              }}
            >
              ログイン
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
