import { type ChatMessageTableRow } from "~/server/db/schema/chat-messages";

export function chatHistory({
  messages,
  names = { user: "Me", partner: "You" },
}: {
  messages: Array<ChatMessageTableRow>;
  names?: { user: string; partner: string };
}) {
  return messages
    .slice(-10)
    .map((chat) => {
      const author = chat.author === "user" ? names.user : names.partner;
      return `${author}: ${chat.text.split("\n").filter(Boolean).join("")}`;
    })
    .join("\n");
}
