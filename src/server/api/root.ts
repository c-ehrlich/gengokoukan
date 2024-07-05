import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { jishoRouter } from "./routers/jisho";
import { chatRouter } from "./routers/chat/chat.router";
import { nameGeneratorRouter } from "./routers/name-generator/name-generator.router";
import { vocabRouter } from "./routers/vocab/vocab.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chat: chatRouter,
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
