import { StarIcon } from "@radix-ui/react-icons";

type AlertProps = {
  title?: string;
  message: string;
  icon?: React.ReactNode;
};
export function CozyAlert({ title, message, icon }: AlertProps) {
  return (
    <div className="flex flex-row items-start gap-2 rounded-xl bg-accent p-2 pt-3 shadow-md">
      <div className="flex items-center justify-center rounded-full bg-orange-200 p-1 shadow-md">
        {icon ?? <StarIcon />}
      </div>
      <div className="flex flex-col gap-1">
        <h5 className="mb-1 font-semibold leading-none tracking-tight">
          {title}
        </h5>
        <div className="text-sm leading-relaxed">{message}</div>
      </div>
    </div>
  );
}
