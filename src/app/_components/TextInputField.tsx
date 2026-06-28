"use client";

import React from "react";
import { ReactNode, ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const input = tv({
  base: "w-full rounded-2xl border px-4 py-3 text-slate-900 shadow-sm outline-none transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20",
  variants: {
    border: {
      normal: "border-slate-300",
      hoverOnly:
        "border-transparent bg-transparent hover:border-slate-300 focus:ring-inset",
    },
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
    readOnly: {
      true: "cursor-default bg-slate-100 text-slate-500 focus:border-slate-300 focus:ring-0 dark:bg-slate-900 dark:text-slate-400",
    },
    error: {
      true: "border-rose-500 focus:border-rose-500 focus:ring-rose-200",
    },
  },
  defaultVariants: {
    border: "normal",
    disabled: false,
    isBusy: false,
    readOnly: false,
    error: false,
  },
});

interface Props
  extends Omit<ComponentPropsWithRef<"input">, "className">,
    VariantProps<typeof input> {
  ref: React.Ref<HTMLInputElement>;
  children?: ReactNode;
  className?: string;
  isBusy?: boolean;
  readOnly?: boolean;
  error?: boolean;
  border?: "normal" | "hoverOnly";
}

export const TextInputField = (props: Props) => {
  const { ref, disabled, className, readOnly, error, isBusy, border, ...rest } =
    props;

  return (
    <input
      ref={ref}
      className={input({ border, disabled, readOnly, error, class: className })}
      disabled={disabled || isBusy}
      readOnly={readOnly}
      type="text"
      {...rest}
    />
  );
};
