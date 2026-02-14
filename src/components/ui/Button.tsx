import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-[var(--color-primary-blue)] text-white hover:bg-[var(--color-primary-deep-blue)] focus:ring-[var(--color-primary-blue)]',
    secondary: 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-1450)] hover:bg-[var(--color-neutral-300)] focus:ring-[var(--color-neutral-500)]',
    outline: 'border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)] hover:text-white focus:ring-[var(--color-primary-blue)]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? disabledStyles : ''}`}
    >
      {children}
    </button>
  );
};
