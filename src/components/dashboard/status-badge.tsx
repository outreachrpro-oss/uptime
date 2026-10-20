import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  up: "border-success/30 bg-success/10 text-success hover:bg-success/10",
  down: "border-danger/30 bg-danger/10 text-danger hover:bg-danger/10",
  degraded:
    "border-warning/30 bg-warning/10 text-warning hover:bg-warning/10",
  paused: "border-border bg-muted text-muted-foreground hover:bg-muted",
  pending:
    "border-primary/30 bg-primary/10 text-primary hover:bg-primary/10",
  unknown: "border-border bg-muted text-muted-foreground hover:bg-muted",
  error: "border-danger/30 bg-danger/10 text-danger hover:bg-danger/10",
  timeout: "border-warning/30 bg-warning/10 text-warning hover:bg-warning/10",
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const style = statusStyles[key] ?? statusStyles.unknown;

  return (
    <Badge
      variant="outline"
      className={cn("capitalize font-medium", style, className)}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
