import { StarIcon } from "@radix-ui/react-icons";

type AlertProps = {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};
export function CozyAlert({ title, children, icon }: AlertProps) {
  return (
    <div className="flex flex-row items-start gap-2 rounded-xl bg-accent p-2 pt-3 shadow-md">
      <div className="flex items-center justify-center rounded-full bg-orange-200 p-1 shadow-md">
        {icon ?? <StarIcon />}
      </div>
      <div className="flex w-full flex-col gap-1">
        <h5 className="mb-1 font-semibold leading-none tracking-tight">
          {title}
        </h5>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
