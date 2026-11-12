export const getStatusColor = (status?: string): string => {
  if (!status) return "bg-muted text-muted-foreground";

  switch (status.toLowerCase()) {
    case "completed":
    case "active":
    case "success":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    case "processing":
    case "trial":
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    case "pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
    case "refunded":
    case "cancelled":
    case "failed":
    case "blocked":
      return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

