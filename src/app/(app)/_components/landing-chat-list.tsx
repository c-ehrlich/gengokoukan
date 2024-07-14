import { DeleteChatButton } from "./delete-chat-button";
import Link from "next/link";
import { type ChatWithPartnerAndMessages } from "~/server/db/schema/chats";

export function LandingChatList({
  header,
  chats,
}: {
  header: string;
  chats: ChatWithPartnerAndMessages[];
}) {
  return (
    <>
      <h3 className="mb-4 text-lg font-medium">{header}</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className="group relative flex flex-col gap-2 rounded-md bg-card p-4 shadow-md transition-shadow hover:shadow-lg dark:bg-card dark:text-card-foreground"
            prefetch={false}
          >
            <h3 className="text-lg font-medium">
              {chat.chatPartner.name || "（名前未設定）"}
            </h3>
            <p className="line-clamp-2 text-muted-foreground dark:text-muted-foreground">
              {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
              {chat.messages[0]?.text || "（まだメッセージがない）"}
            </p>
            <DeleteChatButton chatId={chat.id} />
          </Link>
        ))}
      </div>
    </>
  );
}
