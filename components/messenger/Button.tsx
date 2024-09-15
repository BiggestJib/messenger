"use client";
import clsx from "clsx";
import React, { Children } from "react";
interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `flex justify-center rounded-md px-3 py-2 text-sn font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
        disabled && "opacity-50 cursor-default",
        secondary ? "text-gray-900" : "text-white",
        fullWidth && "w-full",
        danger && "bg-red-500 focus-visible:outline-rose-600 hover:bg-red-400",
        !secondary &&
          !danger &&
          "bg-sky-500 hover:bg-sky-600 focus-visible:otline-sky-600"
      )}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
