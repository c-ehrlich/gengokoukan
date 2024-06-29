import { ensureSignedIn } from "~/components/_utils/ensure-signed-in";
import { Chat } from "./_components/chat";
import { db } from "~/server/db";
import { and, eq } from "drizzle-orm";
import { chatsTable } from "~/server/db/schema/chats";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: { chatid: string };
}) {
  const { chatid } = params;

  const session = await ensureSignedIn();

  const chat = await db.query.chatsTable.findFirst({
    where: and(
      eq(chatsTable.id, chatid),
      eq(chatsTable.userId, session.user.id),
    ),
    with: {
      chat_partner: true,
      messages: {
        limit: 100,
        orderBy: (message, { desc }) => [desc(message.createdAt)],
      },
    },
  });

  if (!chat) {
    redirect("/404");
  }

  return (
    <div>
      <Chat chatId={chatid} chat={chat} />
    </div>
  );
}
