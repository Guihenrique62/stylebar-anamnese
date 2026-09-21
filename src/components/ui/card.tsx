import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Superfície branca com raio 14px, borda cinza e sombra leve. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-(--radius-card) border border-gray-200 bg-background p-5 shadow-(--shadow-card)", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl", className)} {...props} />;
}
