import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { jishoRouter } from "./routers/jisho";
import { nameGeneratorRouter } from "./routers/name-generator/name-generator.router";
import { vocabRouter } from "./routers/vocab/vocab.router";
import { createChat } from "./chat/create-chat";
import { deleteChat } from "./chat/delete-chat";
import { getHint } from "./chat/get-hint";
import { getMessages } from "./chat/get-messages";
import { sendMessage } from "./chat/send-message";
import { getChatList } from "./chat/get-chat-list";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chat: createTRPCRouter({
    createChat: createChat,
    deleteChat: deleteChat,
    getChatList : getChatList,
    getHint: getHint,
    getMessages: getMessages,
    sendMessage: sendMessage,
  }),

  jisho: jishoRouter,
  nameGenerator: nameGeneratorRouter,
  vocab: vocabRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
