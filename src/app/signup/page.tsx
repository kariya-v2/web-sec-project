"use client";

// ServerAction (Custom Invocation) を利用した実装
// （ /api/signup のようなAPIエンドポイントを実装する必要がない ）

import React, { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupRequestSchema, SignupRequest } from "@/app/_types/SignupRequest";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";
import { Button } from "@/app/_components/Button";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { faEye, faEyeSlash, faSpinner, faPenNib } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { signupServerAction } from "@/app/_actions/signup";
import { PasswordStrengthMeter } from "@/app/_components/PasswordStrengthMeter";

const Page: React.FC = () => {
  const c_Name = "name";
  const c_Email = "email";
  const c_Password = "password";

  const router = useRouter();

  const formMethods = useForm<SignupRequest>({
    mode: "onChange",
    resolver: zodResolver(signupRequestSchema),
  });
  const fieldErrors = formMethods.formState.errors;
  const [isPending, startTransition] = useTransition();
  const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const password = formMethods.watch(c_Password) ?? "";

  const setRootError = (errorMsg: string) => {
    formMethods.setError("root", {
      type: "manual",
      message: errorMsg,
    });
  };

  const { onChange: onEmailChange, ...emailRegister } = formMethods.register(c_Email);
  const { onChange: onPasswordChange, ...passwordRegister } = formMethods.register(c_Password);
  const clearRootOnChange =
    (originalOnChange: React.ChangeEventHandler<HTMLInputElement>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      originalOnChange(e);
      formMethods.clearErrors("root");
    };

  useEffect(() => {
    if (isSignUpCompleted) {
      router.replace(`/login?${c_Email}=${formMethods.getValues(c_Email)}`);
      router.refresh();
    }
  }, [formMethods, isSignUpCompleted, router]);

  const onSubmit = async (signupRequest: SignupRequest) => {
    try {
      startTransition(async () => {
        const res = await signupServerAction(signupRequest);
        if (!res.success) {
          setRootError(res.message);
          return;
        }
        setIsSignUpCompleted(true);
      });
    } catch (e) {
      const errorMsg =
        e instanceof Error ? e.message : "予期せぬエラーが発生しました。";
      setRootError(errorMsg);
    }
  };

  return (
    <main className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <FontAwesomeIcon icon={faPenNib} className="text-indigo-600" />
          <span>新規登録</span>
        </div>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          新しいアカウントを作成して、セッションベース認証機能を体験できます。
        </p>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <form
          noValidate
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="grid gap-5"
        >
          <div className="grid gap-2">
            <label htmlFor={c_Name} className="font-semibold text-slate-700 dark:text-slate-200">
              表示名
            </label>
            <TextInputField
              {...formMethods.register(c_Name)}
              id={c_Name}
              placeholder="寝屋川 タヌキ"
              type="text"
              disabled={isPending || isSignUpCompleted}
              error={!!fieldErrors.name}
              autoComplete="name"
            />
            <ErrorMsgField msg={fieldErrors.name?.message} />
          </div>

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
              disabled={isPending || isSignUpCompleted}
              error={!!fieldErrors.email}
              autoComplete="email"
            />
            <ErrorMsgField msg={fieldErrors.email?.message} />
          </div>

          <div className="grid gap-2">
            <label htmlFor={c_Password} className="font-semibold text-slate-700 dark:text-slate-200">
              パスワード
            </label>
            <div className="relative">
              <TextInputField
                {...passwordRegister}
                onChange={clearRootOnChange(onPasswordChange)}
                id={c_Password}
                placeholder="*****"
                type={isPasswordVisible ? "text" : "password"}
                disabled={isPending || isSignUpCompleted}
                error={!!fieldErrors.password}
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-2 py-1 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              >
                <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
              </button>
            </div>
            <PasswordStrengthMeter password={password} />
            <ErrorMsgField msg={fieldErrors.password?.message} />
            <ErrorMsgField msg={fieldErrors.root?.message} />
          </div>

          <Button
            variant="indigo"
            width="stretch"
            className="tracking-widest"
            isBusy={isPending}
            disabled={
              !formMethods.formState.isValid ||
              isPending ||
              isSignUpCompleted
            }
          >
            登録
          </Button>
        </form>
      </section>

      {isSignUpCompleted && (
        <section className="rounded-[1.75rem] border border-indigo-200 bg-indigo-50 p-5 text-slate-700 dark:border-indigo-500/20 dark:bg-slate-900/80 dark:text-slate-100">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FontAwesomeIcon icon={faSpinner} spin className="text-indigo-500" />
            <span>サインアップが完了しました。ログインページへ移動します。</span>
          </div>
          <NextLink href={`/login?${c_Email}=${formMethods.getValues(c_Email)}`} className="mt-3 inline-block text-indigo-700 hover:underline dark:text-indigo-300">
            自動的に画面が切り替わらない場合はこちら
          </NextLink>
        </section>
      )}
    </main>
  );
};

export default Page;
