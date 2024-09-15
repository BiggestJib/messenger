"use client";
import Link from "next/link";
import React from "react";

interface MobileItemProps {
  icon: any;
  href: string;
  active?: boolean | undefined;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <Link
      onClick={handleClick}
      className={`group flex gap-x-2 justify-center p-4 text-sm leading-6 font-semibold w-full hover:text-black hover:bg-gray-100 text-gray-500 ${
        active && "bg-gray-100 text-black"
      } `}
      href={href}
    >
      <Icon className="h-6 w-6 " />
    </Link>
  );
};

export default MobileItem;
