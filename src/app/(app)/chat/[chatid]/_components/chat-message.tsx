import { cn } from "~/components/_utils/cn";
import { BirdIcon, CatIcon } from "lucide-react";

type ChatMessageProps = {
  author: "user" | "ai";
  text: string;
  avatar?: React.ReactNode;
};

export function ChatMessage({ author, text, avatar }: ChatMessageProps) {
  const userRow = author === "user";

  return (
    <div
      className={cn(
        "flex w-full flex-row",
        { "justify-end": userRow },
        {
          "justify-start": !userRow,
        },
      )}
    >
      <div
        className={cn(
          "align-end flex max-w-[80%] items-end justify-start gap-2",
          {
            "flex-row-reverse": userRow,
          },
        )}
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent shadow-md">
          <div>
            {avatar ?? userRow ? <CatIcon className="pt-0.5" /> : <BirdIcon />}
          </div>
        </div>
        <div className="w-full rounded-lg bg-chatbubble px-3 py-2 shadow-md">
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}
