import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { ensureSignedIn } from "~/components/_utils/ensure-signed-in";
import { db } from "~/server/db";
import { type ChatMessageTableRow } from "~/server/db/schema/chat-messages";
import { type ChatPartnerTableRow } from "~/server/db/schema/chat-partners";
import { type ChatTableRow, chatsTable } from "~/server/db/schema/chats";
import { LandingChatList } from "./_components/landing-chat-list";

export type ChatWithPartner = ChatTableRow & {
  chat_partner: ChatPartnerTableRow;
  messages: ChatMessageTableRow[];
};

export default async function RootAppPage() {
  const session = await ensureSignedIn();

  const chats = await db.query.chatsTable.findMany({
    with: {
      chat_partner: true,
      messages: {
        limit: 1,
        orderBy: (message, { desc }) => desc(message.createdAt),
      },
    },
    where: eq(chatsTable.userId, session.user.id),
    // TODO: use updatedAt instead
    orderBy: (chat, { desc }) => desc(chat.createdAt),
    // TODO: infinite scroll
    limit: 50,
  });

  const chatsByRecency = {
    today: [] as ChatWithPartner[],
    yesterday: [] as ChatWithPartner[],
    pastWeek: [] as ChatWithPartner[],
    pastMonth: [] as ChatWithPartner[],
    older: [] as ChatWithPartner[],
  };

  for (const chat of chats) {
    if (chat.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      chatsByRecency.today.push(chat);
    } else if (
      chat.createdAt > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    ) {
      chatsByRecency.yesterday.push(chat);
    } else if (
      chat.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ) {
      chatsByRecency.pastWeek.push(chat);
    } else if (
      chat.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) {
      chatsByRecency.pastMonth.push(chat);
    } else {
      chatsByRecency.older.push(chat);
    }
  }

  const hasChats = chats.length > 0;
  const hasChatsNewerThanThirtyDays =
    chatsByRecency.today.length > 0 ||
    chatsByRecency.yesterday.length > 0 ||
    chatsByRecency.pastWeek.length > 0 ||
    chatsByRecency.pastMonth.length > 0;

  return (
    <>
      {hasChats ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">既存のチャット</h2>
            <Link href="/chat/new">
              <Button variant="secondary" className="rounded-md px-4 py-2">
                チャットを始める
              </Button>
            </Link>
          </div>
          {chatsByRecency.today.length > 0 && (
            <LandingChatList
              header="今日のチャット"
              chats={chatsByRecency.today}
            />
          )}
          {chatsByRecency.yesterday.length > 0 && (
            <LandingChatList
              header="昨日のチャット"
              chats={chatsByRecency.yesterday}
            />
          )}
          {chatsByRecency.pastWeek.length > 0 && (
            <LandingChatList
              header="先週のチャット"
              chats={chatsByRecency.pastWeek}
            />
          )}
          {chatsByRecency.pastMonth.length > 0 && (
            <LandingChatList
              header="先月のチャット"
              chats={chatsByRecency.pastMonth}
            />
          )}
          {chatsByRecency.older.length > 0 && (
            <LandingChatList
              header={
                hasChatsNewerThanThirtyDays
                  ? "その他のチャット"
                  : "全てのチャット"
              }
              chats={chatsByRecency.older}
            />
          )}
        </>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <p className="text-2xl text-muted-foreground dark:text-muted-foreground">
            まだチャットは開始されていない
          </p>
          <Link href="/chat/new">
            <Button variant="default" className="mt-4 py-6 text-xl" size="lg">
              チャットを始める
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}