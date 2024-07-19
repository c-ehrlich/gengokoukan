"use client";

import { ChatInfoTooltip } from "./chat-info-tooltip";
import { ChatMessage } from "./chat-message";
import { TextSelectionPopupContent } from "./text-selection-popup-content";
import { useVoiceInput } from "./user-voice-input";
import { LightbulbIcon, Loader2Icon, MicIcon, SendIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { BasicForm } from "~/components/_primitives/form/basic-form";
import { useZodForm } from "~/components/_primitives/form/use-zod-form";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { Input } from "~/components/_primitives/shadcn-raw/input";
import { Toaster } from "~/components/_primitives/shadcn-raw/toaster";
import {
  BasicTooltip,
  MaybeBasicTooltip,
} from "~/components/_primitives/ui/basic-tooltip";
import { cn } from "~/components/_utils/cn";
import { TextSelectionPopupWrapper } from "~/components/feature/text-selection-popup/text-selection-popup-wrapper";
import { useTextSelectionPopup } from "~/components/feature/text-selection-popup/use-text-selection-popup";
import { type ChatMessageTableRow } from "~/server/db/schema/chat-messages";
import { type ChatWithPartnerAndMessages } from "~/server/db/schema/chats";
import { api } from "~/trpc/react";

const chatMessageSchema = z.object({
  message: z.string().min(1),
});
type chatMessageSchema = z.infer<typeof chatMessageSchema>;

function useChat({ chatId }: { chatId: string }) {
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

  const messagesQuery = api.chat.getMessages.useInfiniteQuery(
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
      const newMessage: ChatMessageTableRow = {
        author: "user",
        text: data.text,
        chatId: chatId,
        id: 123,
        userId: "temp",
        createdAt: new Date(),
        // TODO: change schema to make this optional
        isOpenAIError: null,
        feedback: null,
        corrected: null,
        promptTokens: null,
        completionTokens: null,
        model: null,
        promptVersion: null,
        hint: null,
        suggestedMessage: null,
      } as const;

      utils.chat.getMessages.setInfiniteData(
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
      // reply, feedback, rewritten, ti`mestamp
      const newMessage: ChatMessageTableRow = {
        author: "ai",
        text: res.reply,
        chatId: chatId,
        id: 123,
        userId: "temp",
        createdAt: new Date(),
        // TODO: change schema to make this optional
        isOpenAIError: null,
        feedback: res.feedback,
        corrected: res.rewritten,
        promptTokens: null,
        completionTokens: null,
        model: null,
        promptVersion: null,
        hint: null,
        suggestedMessage: null,
      } as const;

      utils.chat.getMessages.setInfiniteData(
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
    // chatid,
    messagesQuery,
    messagesMutation,
    scrollToBottomRef,
  } = useChat({ chatId });

  const lastMessageId = chat.messages[chat.messages.length - 1]?.id;

  const utils = api.useUtils();
  const hintMutation = api.chat.getHint.useMutation({
    onSuccess: async () => {
      await utils.chat.getMessages.invalidate();
    },
  });

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
    <div className="relative flex h-full min-w-full flex-1 flex-shrink flex-col items-center">
      {messagesQuery.data?.pages[0]?.length ?? 0 > 0 ? (
        <div
          className="relative flex w-full flex-1 flex-col items-center overflow-auto px-2 pt-2"
          {...containerProps}
        >
          <div className="flex w-full max-w-4xl flex-col gap-4 pb-2">
            {[...(messagesQuery.data?.pages ?? [])].reverse().map((page) => (
              <>
                {[...page].reverse().map((message) => (
                  <ChatMessage
                    key={`message-${message.id}`}
                    message={message}
                  />
                ))}
              </>
            ))}
            {messagesMutation.isPending && (
              <p
                className="flex w-full justify-center"
                key="partner-input-placeholder"
              >
                {chat.chatPartner.name}が入力中…
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

      <div className="absolute left-2 top-2">
        <ChatInfoTooltip chat={chat} />
      </div>

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
              autoComplete="off"
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
            <BasicTooltip content="ヒントを表示する">
              <Button
                size="icon"
                variant="secondary"
                onClick={() =>
                  hintMutation.mutate({
                    chatId: chatId,
                    lastMessageId,
                  })
                }
              >
                {hintMutation.isPending ? (
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                ) : (
                  <LightbulbIcon className="h-5 w-5" />
                )}
              </Button>
            </BasicTooltip>
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
      <TextSelectionPopupWrapper {...wrapperProps} selectedText={selectedText}>
        <TextSelectionPopupContent selectedText={selectedText} />
      </TextSelectionPopupWrapper>
      <Toaster />
    </div>
  );
}
