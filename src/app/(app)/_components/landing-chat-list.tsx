import Link from "next/link";
import { type ChatWithPartner } from "../page";

export function LandingChatList({
  header,
  chats,
}: {
  header: string;
  chats: ChatWithPartner[];
}) {
  return (
    <>
      <h3 className="mb-4 text-lg font-medium">{header}</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className="flex flex-col gap-2 rounded-md bg-card p-4 shadow-md transition-shadow hover:shadow-lg dark:bg-card dark:text-card-foreground"
            prefetch={false}
          >
            <h3 className="text-lg font-medium">{chat.chat_partner.name}</h3>
            <p className="line-clamp-2 text-muted-foreground dark:text-muted-foreground">
              {chat.messages[0]?.text}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
