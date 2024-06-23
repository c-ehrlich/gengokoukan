"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { Input } from "~/components/_primitives/shadcn-raw/input";
import { ScrollArea } from "~/components/_primitives/shadcn-raw/scroll-area";
import { api } from "~/trpc/react";
import { ArrowUpIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/_primitives/shadcn-raw/alert";
import { useTextSelectionPopup } from "~/components/feature/text-selection-popup/use-text-selection-popup";
import { TextSelectionPopupWrapper } from "~/components/feature/text-selection-popup/text-selection-popup-wrapper";
import { TextSelectionPopupContent } from "./_components/text-selection-popup-content";

type UserMessage = {
  author: "user";
  text: string;
  timestamp: number;
};
type AIMessage = {
  author: "ai";
  text: string;
  timestamp: number;
  feedback?: string;
};
type Message = UserMessage | AIMessage;

function useChatPage() {
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const { chatid } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  const scrollToBottom = useCallback(() => {
    scrollToBottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  });

  const chatMutation = api.chat.sendMessage.useMutation({
    onMutate: (data) => {
      const newMessage: UserMessage = {
        author: "user",
        text: data.text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage].slice(-10));
    },
    onSuccess: (data) => {
      flushSync(() => {
        const newMessage: AIMessage = {
          author: "ai",
          text: data.reply,
          feedback: data.feedback
            ? `Feedback: ${data.feedback}. A more natural way to write this message would be: "${data.rewritten}".`
            : undefined,
          timestamp: data.timestamp,
        };

        setMessages((prev) => [...prev, newMessage].slice(-10));
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

  const { containerProps, wrapperProps, closeModal, selectedText } =
    useTextSelectionPopup();

  return (
    <div className="flex h-full w-full flex-1 flex-col bg-muted">
      <h1>Chat {JSON.stringify(chatid)}</h1>
      <ScrollArea className="w-full flex-1 border">
        <div
          className="flex min-h-full flex-col justify-end gap-2 px-2"
          {...containerProps}
        >
          <p>
            天気がいいから散歩をしましょう。食べる。飲む。美しい。泣く。読む。早く。大きな。そして。は。が。に。です。ます。ああ。
          </p>
          {messages?.length > 0 ? (
            messages.map((message) => {
              if (message.author === "user") {
                return (
                  <div
                    className="flex w-full justify-end"
                    key={message.timestamp}
                  >
                    <div className="w-4/5 rounded-lg bg-card p-2">
                      <p>{message.text}</p>
                    </div>
                  </div>
                );
              }

              return (
                <>
                  {message.feedback && (
                    <Alert variant="destructive" className="bg-red-200">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Feedback</AlertTitle>
                      <AlertDescription>{message.feedback}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex w-full items-start">
                    <div
                      className="w-4/5 rounded-lg bg-card p-2"
                      key={message.timestamp}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              Send a message to start...
            </div>
          )}
          <div
            style={{ float: "left", clear: "both" }}
            ref={scrollToBottomRef}
          ></div>
        </div>
      </ScrollArea>
      <div className="w-full p-2">
        {chatMutation.isPending && <p>Sending...</p>}
        <div className="flex w-full max-w-4xl flex-row gap-2 rounded-full bg-card p-2">
          <Input
            className="rounded-full border border-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <Button
            size="icon"
            className="rounded-full"
            onClick={() => chatMutation.mutate({ text: input })}
          >
            <ArrowUpIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <TextSelectionPopupWrapper {...wrapperProps}>
        <TextSelectionPopupContent selectedText={selectedText} />
      </TextSelectionPopupWrapper>
    </div>
  );
}
