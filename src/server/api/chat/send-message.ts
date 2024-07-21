import { getProfileQuery } from "../user/get-profile";
import { TRPCError } from "@trpc/server";
import { differenceInYears } from "date-fns";
import { and, eq } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";
import { Models } from "~/server/ai/models";
import { openAiPrompt } from "~/server/ai/open-ai-prompt";
import { PromptNames } from "~/server/ai/prompt-names";
import { chatHistory } from "~/server/api/chat/shared_ai/chat-history";
import { protectedProcedure } from "~/server/api/trpc";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/db-call-with-span";
import { chatMessagesTable } from "~/server/db/schema/chat-messages";
import {
  chatsTable,
  type ChatTableRow,
  type ChatWithMessages,
} from "~/server/db/schema/chats";
import { type UserProfileTableRow } from "~/server/db/schema/user-profiles";

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
  profile: {
    name: string;
    gender: Gender;
    dob: Date;
    location: string;
    jlptLevel: JLPTLevel;
    interests: string;
    goals: string;
  };
  chat: ChatWithMessages;
  newUserMessage: string;
};

function genderString(gender: ChatTableRow["partnerGender"]) {
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

function chatPrompt({ profile, chat, newUserMessage }: ChatPromptArgs) {
  const age = differenceInYears(new Date(), profile.dob);
  return `You are my private Japanese tutor. I am not interested in test preparation etc, I only want to become more comfortable with speaking/writing. We will be practicing conversations. 

Some information about me:
My name is ${profile.name}. I am a ${age} year old ${genderString(profile.gender)} from ${profile.location}.
My interests are: ${profile.interests}.
My current Japanese skill level is: ${jlptLevelString(profile.jlptLevel)}. Please use language that is appropriate for my level.
My language learning goal is to ${profile.goals}.

Some information about you and the conversation we'll be having:
Your name is ${chat.partnerName}. You are a ${chat.partnerAge} year old ${genderString(chat.partnerGender)} from ${chat.partnerOrigin}. We are speaking in the dialect of your region.
${chat.partnerPersonality ? `Your personality is: ${chat.partnerPersonality}` : ""}
${chat.partnerRelation ? `Our relationship is: ${chat.partnerRelation}` : ""}
${chat.partnerSituation ? `The situation we will be practicing is: ${chat.partnerSituation}` : ""}

Feel free to make up your own personality beyond what I have given you. Make up whatever else is needed to answer my questions and keep the conversation going.

For each message I send:
1. Correct the worst mistake or thing that sounds unnatural, and explain why.
2. If you have feedback, please also rewrite the message in a more natural way.
3. Reply to my message. Do your best to keep the conversation going.

Please reply in the following format, which should be JSON compatible:
{
  "feedback": "<your feedback about the grammar / style / situational appropriateness of my message, written as my tutor, in ${feedbackLanguage(profile.jlptLevel)}>",
  "rewritten": "<your rewritten version of my message, written as my tutor, in Japanese>",
  "reply": "<your reply to my message, written as my tutor, in Japanese>"
}

${
  chat.messages.length === 0
    ? "Please get the conversation started by sending the first message."
    : `Below are the most recent messages from our conversation. Please use these to continue the conversation:
${chatHistory({ messages: chat.messages })}
Me: ${newUserMessage}`
}`;
}

const message = ({
  chat,
  userMessage,
  profile,
}: {
  chat: ChatWithMessages;
  userMessage: string;
  profile: UserProfileTableRow;
}) =>
  chatPrompt({
    profile: profile,
    chat: chat,
    newUserMessage: userMessage,
  });

export const sendMessage = protectedProcedure
  .input(sendMessageInputSchema)
  // TODO: output schema
  .mutation(async ({ ctx, input }) => {
    const userMessageTimetamp = Date.now();

    // TODO: stick these in a transaction
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

    const profile = await getProfileQuery({
      db: ctx.db,
      userId: ctx.session.user.id,
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
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
                chat: chat,
                profile: profile,
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
