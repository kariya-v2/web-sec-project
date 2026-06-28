import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/app/_components/Header";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import AuthProvider from "@/app/_contexts/AuthContext";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "WebSecPlayground",
  description: "...",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = async (props) => {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <AuthProvider>
          <Header />
          <main className="mx-auto max-w-4xl px-4 py-6 md:px-6">
            <div className="rounded-[2rem] bg-white/90 p-6 shadow-xl shadow-slate-200/40 ring-1 ring-slate-200 backdrop-blur-sm dark:bg-slate-900/90 dark:shadow-none dark:ring-slate-700">
              {props.children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
