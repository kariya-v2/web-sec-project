"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequest, loginRequestSchema } from "@/app/_types/LoginRequest";
import { UserProfile, userProfileSchema } from "../_types/UserProfile";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";
import { Button } from "@/app/_components/Button";
import { faSpinner, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";
import NextLink from "next/link";
import { ApiResponse } from "../_types/ApiResponse";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const c_Email = "email";
  const c_Password = "password";

  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoginCompleted, setIsLoginCompleted] = useState(false);

  const formMethods = useForm<LoginRequest>({
    mode: "onChange",
    resolver: zodResolver(loginRequestSchema),
  });
  const fieldErrors = formMethods.formState.errors;

  const setRootError = (errorMsg: string) => {
    formMethods.setError("root", {
      type: "manual",
      message: errorMsg,
    });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get(c_Email);
    if (email) {
      formMethods.setValue(c_Email, email);
    }
  }, [formMethods]);

  useEffect(() => {
    if (isLoginCompleted) {
      router.replace("/");
      router.refresh();
    }
  }, [isLoginCompleted, router]);

  const { onChange: onEmailChange, ...emailRegister } = formMethods.register(c_Email);
  const { onChange: onPasswordChange, ...passwordRegister } = formMethods.register(c_Password);
  const clearRootOnChange =
    (originalOnChange: React.ChangeEventHandler<HTMLInputElement>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      originalOnChange(e);
      formMethods.clearErrors("root");
    };

  const onSubmit = async (formValues: LoginRequest) => {
    const ep = "/api/login";

    try {
      setIsPending(true);
      setRootError("");

      const res = await fetch(ep, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
        credentials: "same-origin",
        cache: "no-store",
      });
      setIsPending(false);

      if (!res.ok) return;

      const body = (await res.json()) as ApiResponse<unknown>;
      if (!body.success) {
        setRootError(body.message);
        return;
      }

      setUserProfile(userProfileSchema.parse(body.payload));
      mutate("/api/auth", body);
      setIsLoginCompleted(true);
    } catch (e) {
      const errorMsg =
        e instanceof Error ? e.message : "予期せぬエラーが発生しました。";
      setRootError(errorMsg);
      setIsPending(false);
    }
  };

  return (
    <main className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <FontAwesomeIcon icon={faRightToBracket} className="text-indigo-600" />
          <span>ログイン</span>
        </div>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          登録済みのアカウントでログインして、メンバーコンテンツにアクセスします。
        </p>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <form
          noValidate
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="grid gap-5"
        >
          <div className="grid gap-2">
            <label htmlFor={c_Email} className="font-semibold text-slate-700 dark:text-slate-200">
              メールアドレス（ログインID）
            </label>
            <TextInputField
              {...emailRegister}
              onChange={clearRootOnChange(onEmailChange)}
              id={c_Email}
              placeholder="name@example.com"
              type="email"
              disabled={isPending || isLoginCompleted}
              error={!!fieldErrors.email}
              autoComplete="email"
            />
            <ErrorMsgField msg={fieldErrors.email?.message} />
          </div>

          <div className="grid gap-2">
            <label htmlFor={c_Password} className="font-semibold text-slate-700 dark:text-slate-200">
              パスワード
            </label>
            <TextInputField
              {...passwordRegister}
              onChange={clearRootOnChange(onPasswordChange)}
              id={c_Password}
              placeholder="*****"
              type="password"
              disabled={isPending || isLoginCompleted}
              error={!!fieldErrors.password}
              autoComplete="off"
            />
            <ErrorMsgField msg={fieldErrors.password?.message} />
            <ErrorMsgField msg={fieldErrors.root?.message} />
          </div>

          <Button
            variant="indigo"
            width="stretch"
            className="tracking-widest"
            isBusy={isPending}
            disabled={
              !formMethods.formState.isValid || isPending || isLoginCompleted
            }
          >
            ログイン
          </Button>
        </form>
      </section>

      {isLoginCompleted && (
        <section className="rounded-[1.75rem] border border-indigo-200 bg-indigo-50 p-5 text-slate-700 dark:border-indigo-500/20 dark:bg-slate-900/80 dark:text-slate-100">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FontAwesomeIcon icon={faSpinner} spin className="text-indigo-500" />
            <span>ログインしました。ホーム画面へ移動します。</span>
          </div>
          <NextLink href="/" className="mt-3 inline-block text-indigo-700 hover:underline dark:text-indigo-300">
            自動的に移動しない場合はこちら
          </NextLink>
        </section>
      )}
    </main>
  );
};

export default Page;
