import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";
import { Models } from "~/server/ai/models";
import { openAiPrompt } from "~/server/ai/openAiPrompt";
import { PromptNames } from "~/server/ai/prompt-names";
import { chatHistory } from "~/server/api/chat/shared_ai/chat-history";
import { protectedProcedure } from "~/server/api/trpc";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/db-call-with-span";
import {
  chatMessagesTable,
  type ChatMessageTableRow,
} from "~/server/db/schema/chat-messages";
import { type ChatPartnerTableRow } from "~/server/db/schema/chat-partners";
import { chatsTable } from "~/server/db/schema/chats";

/**
 * SCHEMA
 */

const sendMessageInputSchema = z.object({
  chatId: z.string(),
  text: z.string(),
});

const sendMessageOutputSchema = z.object({
  reply: z.string(),
  feedback: z.string().optional(),
  rewritten: z.string().optional(),
  timestamp: z.number(),
});

const sendMessageAiResponseSchema = sendMessageOutputSchema.omit({
  timestamp: true,
});

/**
 * DB
 */

const getLast100Messages = dbCallWithSpan(
  "getLast100Messages",
  async ({
    db,
    chatId,
    userId,
  }: {
    db: LibSQLDatabase<DBSchema>;
    chatId: string;
    userId: string;
  }) => {
    return db.query.chatsTable.findFirst({
      where: and(eq(chatsTable.id, chatId), eq(chatsTable.userId, userId)),
      with: {
        chatPartner: true,
        messages: {
          limit: 100,
          orderBy: (message, { desc }) => [desc(message.createdAt)],
        },
      },
    });
  },
);

const saveMessages = dbCallWithSpan(
  "saveMessage",
  async ({
    db,
    createdAt,
    chatId,
    userId,
    userInput,
    aiResponse,
  }: {
    db: LibSQLDatabase<DBSchema>;
    createdAt: number;
    chatId: string;
    userId: string;
    userInput: { text: string };
    aiResponse: { reply: string; feedback?: string; rewritten?: string };
  }) => {
    return db
      .insert(chatMessagesTable)
      .values([
        {
          chatId: chatId,
          userId: userId,
          createdAt: new Date(createdAt),
          author: "user",
          text: userInput.text,
        },
        {
          chatId: chatId,
          userId: userId,
          createdAt: new Date(),
          author: "ai",
          model: Models.Powerful,
          text: aiResponse.reply,
          feedback: aiResponse.feedback,
          corrected: aiResponse.rewritten,
        },
      ])
      .returning();
  },
);

/**
 * AI
 */

type JLPTLevel = "N1+" | "N1" | "N2" | "N3" | "N4" | "N5";
type Gender = "male" | "female" | "nonbinary";

type ChatPromptArgs = {
  user: {
    name: string;
    gender: Gender;
    age: number;
    location: string;
    jlptLevel: JLPTLevel;
    interests: string;
    goals: string;
  };
  partner: ChatPartnerTableRow;
  chats: Array<ChatMessageTableRow>;
  newUserMessage: string;
};

function genderString(gender: ChatPartnerTableRow["gender"]) {
  switch (gender) {
    case "male":
      return "man";
    case "female":
      return "woman";
    case "nonbinary":
      return "nonbinary person";
  }
}

function jlptLevelString(jlptLevel: JLPTLevel) {
  switch (jlptLevel) {
    case "N1+":
      return "I have passed JLPT N1 and am looking to improve my conversational skills.";
    case "N1":
      return "I am preparing for JLPT N1.";
    case "N2":
      return "I am preparing for JLPT N2.";
    case "N3":
      return "I am preparing for JLPT N3.";
    case "N4":
      return "I am preparing for JLPT N4.";
    case "N5":
      return "I am preparing for JLPT N5.";
  }
}

function feedbackLanguage(jlptLevel: JLPTLevel) {
  switch (jlptLevel) {
    case "N1+":
      return "Japanese";
    case "N1":
      return "Japanese";
    case "N2":
      return "Japanese";
    case "N3":
      return "English";
    case "N4":
      return "English";
    case "N5":
      return "English";
  }
}

function chatPrompt({ user, partner, chats, newUserMessage }: ChatPromptArgs) {
  return `You are my private Japanese tutor. I am not interested in test preparation etc, I only want to become more comfortable with speaking/writing. We will be practicing conversations. 

Some information about me:
My name is ${user.name}. I am a ${user.age} year old ${genderString(user.gender)} from ${user.location}.
My interests are: ${user.interests}.
My current Japanese skill level is: ${jlptLevelString(user.jlptLevel)}. Please use language that is appropriate for my level.
My language learning goal is to ${user.goals}.

Some information about you and the conversation we'll be having:
Your name is ${partner.name}. You are a ${partner.age} year old ${genderString(partner.gender)} from ${partner.origin}. We are speaking in the dialect of your region.
${partner.personality ? `Your personality is: ${partner.personality}` : ""}
${partner.relation ? `Our relationship is: ${partner.relation}` : ""}
${partner.situation ? `The situation we will be practicing is: ${partner.situation}` : ""}

Feel free to make up your own personality beyond what I have given you. Make up whatever else is needed to answer my questions and keep the conversation going.

For each message I send:
1. Correct the worst mistake or thing that sounds unnatural, and explain why.
2. If you have feedback, please also rewrite the message in a more natural way.
3. Reply to my message. Do your best to keep the conversation going.

Please reply in the following format, which should be JSON compatible:
{
  "feedback": "<your feedback about the grammar / style / situational appropriateness of my message, written as my tutor, in ${feedbackLanguage(user.jlptLevel)}>",
  "rewritten": "<your rewritten version of my message, written as my tutor, in Japanese>",
  "reply": "<your reply to my message, written as my tutor, in Japanese>"
}

${
  chats.length === 0
    ? "Please get the conversation started by sending the first message."
    : `Below are the most recent messages from our conversation. Please use these to continue the conversation:
${chatHistory({ messages: chats })}
Me: ${newUserMessage}`
}`;
}

const message = ({
  partner,
  userMessage,
  messages,
}: {
  partner: ChatPartnerTableRow;
  userMessage: string;
  messages: ChatMessageTableRow[];
}) =>
  chatPrompt({
    user: {
      name: "クリス",
      age: 34,
      gender: "male",
      location: "Vienna, Austria",
      goals:
        "Improve my Japanese speaking skills, in particular to talk to my in-laws.",
      interests: "I like to cook and play video games.",
      jlptLevel: "N1",
    },
    partner: partner,
    chats: messages.reverse(),
    newUserMessage: userMessage,
  });

export const sendMessage = protectedProcedure
  .input(sendMessageInputSchema)
  // TODO: output schema
  .mutation(async ({ ctx, input }) => {
    const userMessageTimetamp = Date.now();

    const chat = await getLast100Messages({
      db: ctx.db,
      userId: ctx.session.user.id,
      chatId: input.chatId,
    });

    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    const aiResponse = await openAiPrompt({
      prompt: {
        name: PromptNames.Chat.Message,
        body: {
          model: "gpt-4o-2024-05-13",
          messages: [
            {
              role: "user",
              content: message({
                userMessage: input.text,
                partner: chat.chatPartner,
                messages: chat.messages,
              }),
            },
          ],
        },
      },
      schema: sendMessageAiResponseSchema,
    });

    const [_persistedUserMessage, persistedAiResponse] = await saveMessages({
      db: ctx.db,
      createdAt: userMessageTimetamp,
      chatId: input.chatId,
      userId: ctx.session.user.id,
      userInput: { text: input.text },
      aiResponse: aiResponse,
    });

    if (!persistedAiResponse) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "AI did not return a message",
      });
    }

    return {
      reply: persistedAiResponse.text,
      feedback: persistedAiResponse.feedback,
      rewritten: persistedAiResponse.corrected,
      timestamp: persistedAiResponse.createdAt.getTime(),
    };
  });
