import type { FichaStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

type Tom = "laranja" | "cinza" | "verde";

const TONS: Record<Tom, string> = {
  laranja: "bg-primary-soft text-primary-hover",
  cinza: "bg-gray-100 text-muted",
  verde: "bg-green-50 text-success",
};

export function Badge({ tom = "cinza", className, children }: { tom?: Tom; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", TONS[tom], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: FichaStatus }) {
  return status === "ENVIADA" ? <Badge tom="laranja">A revisar</Badge> : <Badge tom="verde">Revisada</Badge>;
}
