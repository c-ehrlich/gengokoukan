"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function ChatPage() {
  const { chatid } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { text: string; timestamp: number }[]
  >([]);

  const chatMutation = api.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          text: data.message,
          timestamp: data.timestamp,
        },
      ]);
      setInput("");
    },
  });

  return (
    <div>
      <h1>Chat {JSON.stringify(chatid)}</h1>
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div className="bg-blue-200" key={message.timestamp}>
            <p>{message.text}</p>
            <p>{new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="flex-row gap-2">
        <input
          className="border p-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-green-200 p-2 text-black"
          onClick={() =>
            chatMutation.mutate({
              text: input,
            })
          }
        >
          Click meee
        </button>
      </div>
    </div>
  );
}
