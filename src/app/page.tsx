import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faUser } from "@fortawesome/free-solid-svg-icons";

const links = [
  {
    href: "/login",
    label: "ログイン",
    info: "登録済みユーザー用の認証ページです",
  },
  {
    href: "/signup",
    label: "サインアップ",
    info: "新規ユーザー登録ページです",
  },
  {
    href: "/member/about",
    label: "プロフィール確認",
    info: "ログイン済みユーザーのみアクセス可能です",
  },
];

const Page = () => {
  return (
    <main className="space-y-8">
      <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
          <FontAwesomeIcon icon={faUser} className="text-indigo-600" />
          <span>WebSecPlayground</span>
        </div>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          このアプリは、セッション認証と認可を中心にしたシンプルな機能構成です。ログイン後にプロフィール確認画面へアクセスできます。
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {links.map(({ href, label, info }) => (
          <NextLink
            key={href}
            href={href}
            className="rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950"
          >
            <div className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              <FontAwesomeIcon icon={faCode} className="text-indigo-600" />
              {label}
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{info}</p>
          </NextLink>
        ))}
      </section>
    </main>
  );
};

export default Page;
