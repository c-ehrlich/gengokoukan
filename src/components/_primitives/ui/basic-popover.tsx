import { cn } from "~/components/_utils/cn";

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "~/components/_primitives/shadcn-raw/popover";

type PopoverRowProps = {
  children: React.ReactNode;
  className?: string;
};
export function PopoverRow({ children, className }: PopoverRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 hover:bg-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}

type PopoverIconRowProps = {
  className?: string;
  icon: React.ReactNode;
  text: string;
};
export function PopoverIconRow({ className, icon, text }: PopoverIconRowProps) {
  return (
    <PopoverRow className={className}>
      <div className="flex items-center gap-4">
        {icon}
        {text}
      </div>
    </PopoverRow>
  );
}
