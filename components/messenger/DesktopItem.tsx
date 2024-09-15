"use client";
import Link from "next/link";

import React from "react";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  active: boolean | undefined;
  onClick?: () => void;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <li onClick={handleClick}>
      <Link
        className={`group flex gap-x-2 rounded-md  p-3 text-sm leading-5 font-semibold hover:text-black hover:bg-gray-100 text-gray-500 ${
          active && "bg-gray-100 text-black"
        } `}
        href={href}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
