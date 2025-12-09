import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

export default function Card({
  children,
  hover = false,
  className = "",
}: CardProps) {
  return (
    <div className={`${hover ? "card-hover" : "card"} p-6 ${className}`}>
      {children}
    </div>
  );
}
