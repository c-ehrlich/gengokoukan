import { type ChatModel } from "openai/resources/index.mjs";

export const Models = {
  Powerful: "gpt-4o-2024-05-13",
  Cheap: "gpt-3.5-turbo",
} satisfies Record<string, ChatModel>;
