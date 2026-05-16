"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input field with optional leading icon and pill radius.
 * The dark surface variant lives inside hero gradient sections;
 * the light variant lives inside content surfaces.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  surface?: "dark" | "light";
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leadingIcon, trailingIcon, surface = "dark", invalid, ...props }, ref) => {
    return (
      <div
        className={cn(
          "group relative flex h-[52px] items-center rounded-full border transition-all duration-fast ease-smooth",
          surface === "dark"
            ? "bg-white/[0.04] border-white/15 focus-within:border-primary-400 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(34,197,94,0.12)]"
            : "bg-gray-100 border-transparent text-gray-900 focus-within:border-primary-500 focus-within:shadow-[0_0_0_4px_rgba(34,197,94,0.18)]",
          invalid && "border-danger/70 focus-within:border-danger focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]",
          className
        )}
      >
        {leadingIcon && (
          <span
            className={cn(
              "pl-5 pr-3 flex items-center shrink-0",
              surface === "dark" ? "text-gray-400" : "text-gray-500"
            )}
            aria-hidden
          >
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "flex-1 min-w-0 bg-transparent text-body placeholder:text-gray-500 outline-none",
            surface === "light" && "text-gray-900 placeholder:text-gray-400",
            leadingIcon ? "pl-2" : "pl-5",
            trailingIcon ? "pr-3" : "pr-5"
          )}
          {...props}
        />
        {trailingIcon ? (
          <span
            className={cn(
              "pr-5 flex items-center",
              surface === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          >
            {trailingIcon}
          </span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

/** Multi-line text area sharing the same visual rhythm. */
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  surface?: "dark" | "light";
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, surface = "dark", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[120px] rounded-lg p-4 text-body outline-none transition-all duration-fast resize-none",
          surface === "dark"
            ? "bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 focus:border-primary-400 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)]"
            : "bg-gray-100 text-gray-900 placeholder:text-gray-400 border border-transparent focus:border-primary-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.18)]",
          className
        )}
        {...props}
      />
    );
  }
);
TextArea.displayName = "TextArea";

/** Field wrapper providing a label + helper text shell. */
export function Field({
  label,
  hint,
  error,
  children,
  required,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-left">
      {label && (
        <span className="text-small font-medium text-gray-300">
          {label}
          {required ? <span className="ml-1 text-primary-400">*</span> : null}
        </span>
      )}
      {children}
      {error ? (
        <span className="text-caption text-danger">{error}</span>
      ) : hint ? (
        <span className="text-caption text-gray-500">{hint}</span>
      ) : null}
    </label>
  );
}
