import { InfoCircledIcon } from "@radix-ui/react-icons";
import { BasicTooltip } from "~/components/_primitives/ui/basic-tooltip";
import { formalityStringFromOption } from "~/server/db/schema/chat-partners";
import { type ChatWithPartnerAndMessages } from "~/server/db/schema/chats";

export function ChatInfoTooltip({
  chat,
}: {
  chat: ChatWithPartnerAndMessages;
}) {
  return (
    <BasicTooltip
      content={
        <div className="flex flex-col gap-2">
          <p>Chat with {chat.chat_partner.name}</p>
          <ChatInfoTooltipSection
            header="年齢"
            content={`${String(chat.chat_partner.age)}歳`}
          />
          <ChatInfoTooltipSection
            header="性別"
            content={chat.chat_partner.gender}
          />
          <ChatInfoTooltipSection
            header="出身"
            content={chat.chat_partner.origin}
          />
          <ChatInfoTooltipSection
            header="人格"
            content={chat.chat_partner.personality}
          />
          <ChatInfoTooltipSection
            header="関係"
            content={chat.chat_partner.relation}
          />
          <ChatInfoTooltipSection
            header="状況"
            content={chat.chat_partner.situation}
          />
          {chat.chat_partner.formality && (
            <ChatInfoTooltipSection
              header="話し方"
              content={formalityStringFromOption(chat.chat_partner.formality)}
            />
          )}

          <div>
            <h2></h2>
          </div>
        </div>
      }
    >
      <InfoCircledIcon className="h-6 w-6" />
    </BasicTooltip>
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
