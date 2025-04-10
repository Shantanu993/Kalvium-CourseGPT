import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  footer,
  hoverable = false,
}) => {
  return (
    <div
      className={twMerge(
        "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
        hoverable && "transition-all hover:shadow-md",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="p-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">{footer}</div>
      )}
    </div>
  );
};

export default Card;
