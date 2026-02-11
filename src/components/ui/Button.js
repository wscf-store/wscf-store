'use client';

import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-accent hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
  secondary:
    'bg-primary-900 hover:bg-primary-950 text-white shadow-lg',
  outline:
    'border-2 border-accent text-accent hover:bg-accent hover:text-white',
  ghost:
    'text-gray-700 hover:bg-gray-100',
  danger:
    'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25',
  success:
    'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
  xl: 'px-10 py-4 text-lg',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      disabled = false,
      loading = false,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-xl font-semibold
          transition-all duration-300 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-[0.98] transform
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : Icon ? (
          <Icon className="h-4 w-4" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
