import { type ChatMessageTableRow } from "~/server/db/schema/chat-messages";

export function chatHistory({
  chats,
  names = { user: "Me", partner: "You" },
}: {
  chats: Array<ChatMessageTableRow>;
  names?: { user: string; partner: string };
}) {
  return chats
    .slice(-10)
    .map((chat) => {
      const author = chat.author === "user" ? names.user : names.partner;
      return `${author}: ${chat.text.split("\n").filter(Boolean).join("")}`;
    })
    .join("\n");
}
