"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { Input } from "~/components/_primitives/shadcn-raw/input";
import { api } from "~/trpc/react";
import { useTextSelectionPopup } from "~/components/feature/text-selection-popup/use-text-selection-popup";
import { TextSelectionPopupWrapper } from "~/components/feature/text-selection-popup/text-selection-popup-wrapper";
import { type ChatWithPartnerAndMessages } from "~/server/db/schema/chats";
import { CozyAlert } from "~/components/_primitives/ui/cozy-alert";
import { ChatMessage } from "./chat-message";
import { MicIcon, SendIcon } from "lucide-react";
import { z } from "zod";
import { useZodForm } from "~/components/_primitives/form/use-zod-form";
import { BasicForm } from "~/components/_primitives/form/basic-form";
import { type SubmitHandler } from "react-hook-form";
import { TextSelectionPopupContent } from "./text-selection-popup-content";
import { useVoiceInput } from "./useVoiceInput";
import { MaybeBasicTooltip } from "~/components/_primitives/ui/basic-tooltip";
import { cn } from "~/components/_utils/cn";

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

const chatMessageSchema = z.object({
  message: z.string().min(1),
});
type chatMessageSchema = z.infer<typeof chatMessageSchema>;

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
      form.reset();
    },
    onSuccess: (res) => {
      // reply, feedback, rewritten, timestamp
      const newMessage = {
        author: "ai",
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

  const form = useZodForm({
    schema: chatMessageSchema,
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<chatMessageSchema> = async (data) => {
    messagesMutation.mutate({ chatId: chatId, text: data.message });
  };

  return {
    form,
    onSubmit,
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
  const {
    form,
    onSubmit,
    chatid,
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

  const { listening } = useVoiceInput({
    form: form,
    formField: "message",
  });

  return (
    // TODO: dont do this calc!
    <div className="flex h-[calc(100%-56px)] w-full flex-1 flex-shrink flex-col items-center bg-chat">
      {/* <div className="flex max-w-4xl items-center justify-between gap-2 p-2">
        <h1>{chat.chat_partner.name}との会話</h1>
        <ChatInfoTooltip chat={chat} />
      </div> */}
      {messagesQuery.data?.pages[0]?.length ?? 0 > 0 ? (
        <div
          className="flex w-full flex-1 flex-col items-center overflow-auto px-2 pt-2"
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
          <BasicForm
            form={form}
            onSubmit={onSubmit}
            className="w-full"
            contentClassName="flex-row w-full gap-3"
          >
            <Input
              className="flex-1 rounded-full border border-gray-500"
              placeholder="メッセージを入力..."
              {...form.register("message")}
            />
            {listening ? (
              <Button
                size="icon"
                variant="secondary"
                className="shadow-md, animate-pulse rounded-full bg-green-500"
              >
                <MicIcon className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full shadow-md"
              >
                <MicIcon className="h-5 w-5" />
              </Button>
            )}
            <MaybeBasicTooltip
              enabled={!form.formState.isValid}
              content="Please input before submitting"
            >
              <Button
                size="icon"
                type="submit"
                className={cn("rounded-full bg-accent shadow-md", {
                  "cursor-not-allowed": !form.formState.isValid,
                })}
                disabled={messagesMutation.isPending || !form.formState.isValid}
                onClick={() =>
                  messagesMutation.mutate({
                    chatId: chatId,
                    text: form.getValues("message"),
                  })
                }
              >
                <SendIcon className="h-5 w-5 pr-0.5 pt-0.5" />
              </Button>
            </MaybeBasicTooltip>
          </BasicForm>
        </div>
      </div>
      <TextSelectionPopupWrapper {...wrapperProps}>
        <TextSelectionPopupContent selectedText={selectedText} />
      </TextSelectionPopupWrapper>
    </div>
  );
}
