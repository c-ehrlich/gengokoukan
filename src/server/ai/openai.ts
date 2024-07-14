import OpenAISDK from "openai";
import { env } from "~/env";

const OPENAI_ORG = "org-0IRyny6cT8p93m0F9vVRk3I6";
const OPENAI_PROJECT_ID = "proj_NC6HDygRJAjuMOuAzOHgoezf";

export const OpenAI = new OpenAISDK({
  organization: OPENAI_ORG,
  project: OPENAI_PROJECT_ID,
  apiKey: env.OPENAI_API_KEY,
});
