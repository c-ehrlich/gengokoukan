import { CatIcon, UserIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarImage,
} from "~/components/_primitives/shadcn-raw/avatar";
import { BasicCollapsible } from "~/components/_primitives/ui/collapsible";
import { CozyAlert } from "~/components/_primitives/ui/cozy-alert";
import { cn } from "~/components/_utils/cn";
import { type ChatMessageTableRow } from "~/server/db/schema/chat-messages";

type ChatMessageProps = {
  message: ChatMessageTableRow;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { author, text } = message;
  const userRow = author === "user";

  if (author === "hint") {
    return <HintMessage message={message} />;
  }

  return (
    <React.Fragment>
      <Feedback message={message} />
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
              {userRow ? (
                <Avatar className="flex h-8 w-8 items-center justify-center">
                  {false ? <AvatarImage src={undefined} /> : <UserIcon />}
                </Avatar>
              ) : (
                <CatIcon className="pt-0.5" />
              )}
            </div>
          </div>
          <div className="w-full rounded-lg bg-chatbubble px-3 py-2 shadow-md">
            <p>{text}</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function HintMessage({ message }: { message: ChatMessageTableRow }) {
  return (
    <div className="flex w-full justify-center">
      <div className="w-3/4">
        <CozyAlert title="ヒント">
          <React.Fragment>
            <p>{message.hint}</p>
            <BasicCollapsible
              trigger="推奨メッセージを表示"
              defaultOpen={false}
            >
              {message.suggestedMessage}
            </BasicCollapsible>
          </React.Fragment>
        </CozyAlert>
      </div>
    </div>
  );
}

function Feedback({ message }: { message: ChatMessageTableRow }) {
  if (!message.feedback) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
      <div className="w-3/4">
        <CozyAlert title="フィードバック">{message.feedback}</CozyAlert>
        {/* TODO: do we also want to work with `message.corrected`? */}
      </div>
    </div>
  );
}
