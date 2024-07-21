import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/_primitives/shadcn-raw/popover";
import {
  formalityStringFromOption,
  genderStrings,
  type ChatWithMessages,
} from "~/server/db/schema/chats";

export function ChatInfoTooltip({ chat }: { chat: ChatWithMessages }) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="z-50 cursor-pointer rounded-full border border-accent bg-chatbubble p-0.5 shadow-md hover:bg-chat">
          <InfoCircledIcon className="h-6 w-6" />
        </div>
      </PopoverTrigger>
      <PopoverContent collisionPadding={8}>
        <div className="flex flex-col gap-2">
          <p>Chat with {chat.partnerName}</p>
          <ChatInfoTooltipSection
            header="年齢"
            content={`${String(chat.partnerAge)}歳`}
          />
          <ChatInfoTooltipSection
            header="性別"
            content={genderStrings[chat.partnerGender]}
          />
          <ChatInfoTooltipSection header="出身" content={chat.partnerOrigin} />
          <ChatInfoTooltipSection
            header="人格"
            content={chat.partnerPersonality}
          />
          <ChatInfoTooltipSection
            header="関係"
            content={chat.partnerRelation}
          />
          <ChatInfoTooltipSection
            header="状況"
            content={chat.partnerSituation}
          />
          {chat.partnerFormality && (
            <ChatInfoTooltipSection
              header="話し方"
              content={formalityStringFromOption(chat.partnerFormality)}
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
