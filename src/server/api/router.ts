import { createChatDetailed } from "./chat/create-chat-detailed";
import { createChatSmalltalk } from "./chat/create-chat-smalltalk";
import { deleteChat } from "./chat/delete-chat";
import { getChat } from "./chat/get-chat";
import { getChatList } from "./chat/get-chat-list";
import { getHint } from "./chat/get-hint";
import { getMessages } from "./chat/get-messages";
import { sendMessage } from "./chat/send-message";
import { getDefinition } from "./jisho/get-definition";
import { getName } from "./name-generator/get-name";
import { createProfile } from "./user/create-profile";
import { editProfile } from "./user/edit-profile";
import { getProfile } from "./user/get-profile";
import { bumpSRS } from "./vocab/bump-srs";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chat: createTRPCRouter({
    createChatDetailed: createChatDetailed,
    createChatSmalltalk: createChatSmalltalk,
    deleteChat: deleteChat,
    getChatList: getChatList,
    getChat: getChat,
    getHint: getHint,
    getMessages: getMessages,
    sendMessage: sendMessage,
  }),

  jisho: createTRPCRouter({
    getDefinition: getDefinition,
  }),

  nameGenerator: createTRPCRouter({
    getName: getName,
  }),

  user: createTRPCRouter({
    createProfile: createProfile,
    editProfile: editProfile,
    getProfile: getProfile,
  }),

  vocab: createTRPCRouter({
    bumpSRS: bumpSRS,
  }),
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
