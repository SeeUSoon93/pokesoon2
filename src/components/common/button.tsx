import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
