import { cn } from "~/components/_utils/cn";

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export function Chip({ children, className }: ChipProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-chatbubble px-1.5 py-[1px] text-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
