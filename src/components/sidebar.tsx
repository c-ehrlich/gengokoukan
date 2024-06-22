import Link from "next/link";

type Chats = Array<{
  time: string;
  chats: Array<{ name: string; id: string }>;
}>;

const chats: Chats = [
  { time: "Today", chats: [{ id: "1", name: "Chat 1" }] },
  {
    time: "Yesterday",
    chats: [
      { id: "2", name: "Chat 2" },
      { id: "3", name: "Chat 3" },
      { id: "4", name: "Chat 4" },
    ],
  },
  {
    time: "Last Week",
    chats: [
      { id: "5", name: "Chat 5" },
      { id: "6", name: "Chat 6" },
      { id: "7", name: "Chat 7" },
    ],
  },
];

function ChatsList({ chats }: { chats: Chats }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {chats.map((chatGroup) => (
        <div key={chatGroup.time} className="flex flex-col gap-2">
          <h1 className="text-gray-400">{chatGroup.time}</h1>
          <div className="flex flex-col gap-2 pl-2">
            {chatGroup.chats.map((chat) => (
              <Link key={`chat-menu-item-${chat.id}`} href={`/chat/${chat.id}`}>
                <p key={`chat-menu-item-${chat.id}`}>{chat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="flex w-1/6 flex-col items-start bg-background p-4">
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-xl">Header</h1>
        <ChatsList chats={chats} />
      </div>
    </div>
  );
}
