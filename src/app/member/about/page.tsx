"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdBadge, faSpinner } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  const { userProfile, isLoading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!userProfile) {
      router.replace("/login");
      return;
    }
    setIsReady(true);
  }, [isLoading, userProfile, router]);

  if (isLoading || !isReady || !userProfile) {
    return (
      <main>
        <div className="text-2xl font-bold">
          <FontAwesomeIcon icon={faIdBadge} className="mr-1.5" />
          プロフィール
        </div>
        <div className="mt-4 flex items-center gap-x-2 text-slate-600 dark:text-slate-300">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          <span>認証情報を確認しています...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <FontAwesomeIcon icon={faIdBadge} className="text-indigo-600" />
          <span>プロフィール確認</span>
        </div>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          このページはログイン済みユーザーのみアクセスできます。
        </p>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">ログインユーザー情報</div>
        <div className="mt-4 space-y-3 text-slate-700 dark:text-slate-200">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm text-slate-500">表示名</div>
            <div className="mt-1 text-base font-medium">{userProfile.name}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm text-slate-500">メールアドレス</div>
            <div className="mt-1 text-base font-medium">{userProfile.email}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm text-slate-500">ユーザー権限</div>
            <div className="mt-1 text-base font-medium">{userProfile.role}</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
