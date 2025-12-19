import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Túlio C. F. Gomes - Resume",
  description:
    "Full Stack Developer specializing in React, Node.js, and TypeScript",
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
