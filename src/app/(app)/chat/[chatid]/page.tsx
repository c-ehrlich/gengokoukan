import { ensureSignedIn } from "~/components/_utils/ensure-signed-in";
import { Chat } from "./_components/chat";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { getChatWithPartnerAndMessages } from "~/server/api/chat/shared_db/get-chat-with-partner-and-messages";

export default async function ChatPage({
  params,
}: {
  params: { chatid: string };
}) {
  const { chatid } = params;

  const session = await ensureSignedIn();

  const chat = await getChatWithPartnerAndMessages({
    db: db,
    chatId: chatid,
    userId: session.user.id,
  });

  if (!chat) {
    redirect("/404");
  }

  return <Chat chatId={chatid} chat={chat} />;
}
