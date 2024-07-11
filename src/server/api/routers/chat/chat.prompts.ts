import { type ChatMessageTableRow } from "~/server/db/schema/chat-messages";
import { type ChatPartnerTableRow } from "~/server/db/schema/chat-partners";

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

function chatHistory({
  chats,
  names = { user: "Me", partner: "You" },
}: {
  chats: Array<ChatMessageTableRow>;
  names?: { user: string; partner: string };
}) {
  return chats
    .slice(-10)
    .map((chat) => {
      const author = chat.author === "user" ? names.user : names.partner;
      return `${author}: ${chat.text.split("\n").filter(Boolean).join("")}`;
    })
    .join("\n");
}

export function chatPrompt({
  user,
  partner,
  chats,
  newUserMessage,
}: ChatPromptArgs) {
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
${chatHistory({ chats })}
Me: ${newUserMessage}`
}`;
}

type ChatHintPromptArgs = {
  partner: ChatPartnerTableRow;
  chats: Array<ChatMessageTableRow>;
};

export function chatHintPrompt({ partner, chats }: ChatHintPromptArgs) {
  const userName = "あなた";
  const partnerName = "相手";

  return `以下は二人の間で交わされた最近のメッセージです：

${chatHistory({ chats, names: { user: userName, partner: partnerName } })}

状況は：${partner.situation}

次の項目を提供してください：

${userName}が次に言うと良いことのヒント
${userName}が送ると良いとされるメッセージ
次の形式で提供してください。JSON解析可能である必要があります：

{
  "hint": "<hint>",
  "suggestedMessage": "<suggested message>"
}`;
}
