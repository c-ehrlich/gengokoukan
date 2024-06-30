"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { Input } from "~/components/_primitives/shadcn-raw/input";
import { ScrollArea } from "~/components/_primitives/shadcn-raw/scroll-area";
import { api } from "~/trpc/react";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { useTextSelectionPopup } from "~/components/feature/text-selection-popup/use-text-selection-popup";
import { TextSelectionPopupWrapper } from "~/components/feature/text-selection-popup/text-selection-popup-wrapper";
import { TextSelectionPopupContent } from "./text-selection-popup-content";
import { type ChatWithPartnerAndMessages } from "~/server/db/schema/chats";
import { ChatInfoTooltip } from "./chat-info-tooltip";
import { CozyAlert } from "~/components/_primitives/ui/cozy-alert";
import { ChatMessage } from "./chat-message";

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

function useChat({
  chatId,
  chat,
}: {
  chatId: string;
  chat: ChatWithPartnerAndMessages;
}) {
  const utils = api.useUtils();

  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const { chatid } = useParams();
  const [input, setInput] = useState("");

  const scrollToBottom = useCallback(() => {
    scrollToBottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  });

  const messagesQuery = api.chat.messages.useInfiniteQuery(
    {
      chatId: chatId,
      limit: 10,
    },
    {
      getNextPageParam: (_lastPage) => {
        return 0;
        // const lastMessageCreatedAt = lastPage[lastPage.length - 1]?.timestamp;
        // return lastMessageCreatedAt ? lastMessageCreatedAt : null;
      },
    },
  );

  const messagesMutation = api.chat.sendMessage.useMutation({
    onMutate: (data) => {
      const newMessage = {
        author: "user",
        text: data.text,
        timestamp: Date.now(),
        chatId: chatId,
        id: 123,
        userId: "temp",
        createdAt: new Date(),
        // TODO: change schema to make this optional
        is_openai_error: null,
        feedback: null,
        corrected: null,
        prompt_tokens: null,
        completion_tokens: null,
        model: null,
        prompt_version: null,
      } as const;

      utils.chat.messages.setInfiniteData(
        {
          chatId: chatId,
          limit: 10,
        },
        (prev) => {
          if (!prev) {
            return {
              pages: [[newMessage]],
              pageParams: [],
            };
          }

          return {
            ...prev,
            // TODO: create empty page if necessary
            pages: prev.pages.map((page, idx) => {
              if (idx !== 0) return page;
              return [newMessage, ...page];
            }),
          };
        },
        {
          updatedAt: Date.now(),
        },
      );

      scrollToBottom();
      setInput("");
    },
    onSuccess: (res) => {
      // reply, feedback, rewritten, timestamp
      const newMessage = {
        author: "user",
        text: res.reply,
        timestamp: res.timestamp,
        chatId: chatId,
        id: 123,
        userId: "temp",
        createdAt: new Date(),
        // TODO: change schema to make this optional
        is_openai_error: null,
        feedback: res.feedback,
        corrected: res.rewritten,
        prompt_tokens: null,
        completion_tokens: null,
        model: null,
        prompt_version: null,
      } as const;

      utils.chat.messages.setInfiniteData(
        {
          chatId: chatId,
          limit: 10,
        },
        (prev) => {
          if (!prev) {
            return {
              pages: [[newMessage]],
              pageParams: [],
            };
          }

          return {
            ...prev,
            pages: prev.pages.map((page, idx) => {
              if (idx !== 0) return page;
              return [newMessage, ...page];
            }),
          };
        },
      );

      scrollToBottom();
    },
  });

  return {
    chatid,
    input,
    setInput,
    scrollToBottomRef,
    messagesQuery,
    messagesMutation,
  };
}

type ChatProps = {
  chatId: string;
  chat: ChatWithPartnerAndMessages;
};

export function Chat({ chatId, chat }: ChatProps) {
  // TODO: switch to a form instead

  const {
    chatid,
    input,
    setInput,
    messagesQuery,
    messagesMutation,
    scrollToBottomRef,
  } = useChat({ chatId, chat });

  const {
    containerProps,
    wrapperProps,
    // closeModal,
    selectedText,
  } = useTextSelectionPopup();

  return (
    <div className="bg-chat flex h-[calc(100%-56px)] w-full flex-1 flex-shrink flex-col items-center">
      {/* <div className="flex max-w-4xl items-center justify-between gap-2 p-2">
        <h1>{chat.chat_partner.name}との会話</h1>
        <ChatInfoTooltip chat={chat} />
      </div> */}
      {messagesQuery.data?.pages[0]?.length ?? 0 > 0 ? (
        <div
          className="flex w-full flex-col items-center overflow-auto px-2 pt-2"
          {...containerProps}
        >
          <div className="flex max-w-4xl flex-col gap-4 pb-2">
            {[...(messagesQuery.data?.pages ?? [])].reverse().map((page) => (
              <>
                {[...page].reverse().map((message) => (
                  <>
                    {message.feedback && (
                      <div className="flex w-full justify-center">
                        <div className="w-3/4">
                          <CozyAlert
                            title="フィードバック"
                            message={message.feedback}
                          />
                        </div>
                      </div>
                    )}
                    <ChatMessage
                      key={message.id}
                      author={message.author ?? "ai"}
                      text={message.text}
                    />
                  </>
                ))}
              </>
            ))}
            {messagesMutation.isPending && (
              <p
                className="flex w-full justify-center"
                key="partner-input-placeholder"
              >
                {chat.chat_partner.name}が入力中…
              </p>
            )}
            <div
              style={{ float: "left", clear: "both" }}
              ref={scrollToBottomRef}
            ></div>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xl">
          メッセージを送って会話を始めよう...
        </div>
      )}

      <div className="flex w-full max-w-4xl justify-center px-2 pb-2">
        <div className="flex w-full max-w-4xl flex-row gap-2 rounded-full bg-card p-2">
          <Input
            className="rounded-full border border-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
          />
          <Button
            size="icon"
            className="rounded-full"
            onClick={() =>
              messagesMutation.mutate({ chatId: chatId, text: input })
            }
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
