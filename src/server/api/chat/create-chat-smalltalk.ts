import { makeGimeiName } from "../name-generator/get-name";
import { protectedProcedure } from "../trpc";
import { type CreateChatSchemaClient } from "./create-chat-detailed.schema";
import {
  type CreateChatSmalltalkSchema,
  createChatSmalltalkSchema,
} from "./create-chat-smalltalk.schema";
import { createChat } from "./shared_db/create-chat";
import { TRPCError } from "@trpc/server";

function createRelationString(relation: CreateChatSmalltalkSchema["relation"]) {
  switch (relation) {
    // TODO: test these (maybe we dont need to no kaiwa etc)
    case "family":
      return "お家族との会話";
    case "friend":
      return "友達との会話";
    case "acquaintance":
      return "友人との会話";
  }
}

function createSituationString(topic: string) {
  return `「${topic} 」に関する会話。`;
}

function createChatSmalltalkInput({
  relation,
  topic,
}: CreateChatSmalltalkSchema): CreateChatSchemaClient {
  const partnerGender = Math.random() > 0.5 ? "male" : "female";
  const partnerName = makeGimeiName(partnerGender);

  // TODO: generate a better prompt
  return {
    partnerName: partnerName,
    partnerAge: Math.floor(Math.random() * 42 + 18), // 18-60
    partnerGender: partnerGender,
    partnerOrigin: "東京",
    partnerFormality: "sonkeigo",
    partnerPersonality: "friendly, likes small talk",
    partnerRelation: createRelationString(relation),
    partnerSituation: createSituationString(topic),
  };
}

/**
 * PROCEDURE
 */
export const createChatSmalltalk = protectedProcedure
  .input(createChatSmalltalkSchema)
  .mutation(async ({ input, ctx }) => {
    const { chatId } = await createChat({
      db: ctx.db,
      userId: ctx.session.user.id,
      input: createChatSmalltalkInput(input),
    });

    if (!chatId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create chat",
      });
    }

    return { chatId: chatId };
  });
