import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/_primitives/shadcn-raw/popover";
import {
  formalityStringFromOption,
  genderStrings,
} from "~/server/db/schema/chat-partners";
import { type ChatWithPartnerAndMessages } from "~/server/db/schema/chats";

export function ChatInfoTooltip({
  chat,
}: {
  chat: ChatWithPartnerAndMessages;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="z-50 cursor-pointer rounded-full border border-accent bg-chatbubble p-0.5 shadow-md hover:bg-chat">
          <InfoCircledIcon className="h-6 w-6" />
        </div>
      </PopoverTrigger>
      <PopoverContent collisionPadding={8}>
        <div className="flex flex-col gap-2">
          <p>Chat with {chat.chatPartner.name}</p>
          <ChatInfoTooltipSection
            header="年齢"
            content={`${String(chat.chatPartner.age)}歳`}
          />
          <ChatInfoTooltipSection
            header="性別"
            content={genderStrings[chat.chatPartner.gender]}
          />
          <ChatInfoTooltipSection
            header="出身"
            content={chat.chatPartner.origin}
          />
          <ChatInfoTooltipSection
            header="人格"
            content={chat.chatPartner.personality}
          />
          <ChatInfoTooltipSection
            header="関係"
            content={chat.chatPartner.relation}
          />
          <ChatInfoTooltipSection
            header="状況"
            content={chat.chatPartner.situation}
          />
          {chat.chatPartner.formality && (
            <ChatInfoTooltipSection
              header="話し方"
              content={formalityStringFromOption(chat.chatPartner.formality)}
            />
          )}

          <div>
            <h2></h2>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ChatInfoTooltipSection({
  header,
  content,
}: {
  header?: string;
  content?: string | null;
}) {
  if (!header || !content) return null;

  return (
    <div>
      <h2 className="font-bold">{header}</h2>
      <p>{content}</p>
    </div>
  );
}
