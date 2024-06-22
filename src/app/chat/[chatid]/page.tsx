"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "~/components/_primitives/ui/button";
import { ScrollArea } from "~/components/_primitives/ui/scroll-area";
import { api } from "~/trpc/react";

function useChatPage() {
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const { chatid } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { text: string; timestamp: number }[]
  >([]);

  const scrollToBottom = useCallback(() => {
    scrollToBottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  });

  const chatMutation = api.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      flushSync(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: data.message,
            timestamp: data.timestamp,
          },
        ]);
      });

      scrollToBottom();
      setInput("");
    },
  });

  return {
    chatid,
    input,
    setInput,
    messages,
    chatMutation,
    scrollToBottomRef,
  };
}

export default function ChatPage() {
  const { chatid, input, setInput, messages, chatMutation, scrollToBottomRef } =
    useChatPage();

  return (
    <div>
      <h1>Chat {JSON.stringify(chatid)}</h1>
      <ScrollArea className="h-72 w-48 rounded-md border">
        <div className="flex min-h-full flex-col justify-end gap-2">
          {messages.map((message) => (
            <div className="bg-blue-200" key={message.timestamp}>
              <p>{message.text}</p>
              <p>{new Date(message.timestamp).toLocaleString()}</p>
            </div>
          ))}
          <div
            style={{ float: "left", clear: "both" }}
            ref={scrollToBottomRef}
          ></div>
        </div>
      </ScrollArea>
      <div className="flex-row gap-2">
        <input
          className="border p-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={() => chatMutation.mutate({ text: input })}>
          Send
        </Button>
      </div>
    </div>
  );
}
