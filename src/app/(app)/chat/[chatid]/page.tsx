import { Chat } from "./_components/chat";
import { redirect } from "next/navigation";
import { ensureSignedIn } from "~/components/_utils/ensure-signed-in";
import { api } from "~/trpc/server";

export default async function ChatPage({
  params,
}: {
  params: { chatid: string };
}) {
  await ensureSignedIn();

  const { chatid } = params;

  const chat = await api.chat.getChat({
    chatId: chatid,
  });

  if (!chat) {
    redirect("/404");
  }

  return <Chat chatId={chatid} chat={chat} />;
}
