"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/_primitives/shadcn-raw/tabs";
import { CreateChatForm } from "./custom-chat-form";
import { ListIcon, MessagesSquareIcon, WrenchIcon } from "lucide-react";
import { SituationChatForm } from "./situation-chat-form";
import { SmalltalkChatForm } from "./smalltalk-chat-form";

type Tab = {
  text: string;
  icon: React.ReactNode;
  value: string;
  content: React.ReactNode;
};

const ICON_CLASS_NAME = "w-5 h-5";
const tabs: Tab[] = [
  {
    text: "状況を選ぶ",
    icon: <ListIcon className={ICON_CLASS_NAME} />,
    value: "situation",
    content: <SituationChatForm />,
  },
  {
    text: "フリートーク",
    icon: <MessagesSquareIcon className={ICON_CLASS_NAME} />,
    value: "smalltalk",
    content: <SmalltalkChatForm />,
  },
  {
    text: "詳細設定",
    icon: <WrenchIcon className={ICON_CLASS_NAME} />,
    value: "design",
    content: <CreateChatForm />,
  },
];

export function CreateChat() {
  return (
    <div className="flex flex-col gap-4">
      {/* <h1 className="text-2xl font-semibold">新しい会話を作成</h1> */}
      <Tabs
        defaultValue="situation"
        className="flex w-full flex-col items-center justify-center gap-4"
      >
        <TabsList className="flex gap-1 shadow-lg">
          {tabs.map((tab) => (
            <TabsTrigger
              key={`tab-trigger-${tab.value}`}
              className="flex min-w-48 flex-row items-center justify-center gap-2 shadow-inner"
              value={tab.value}
            >
              {tab.icon}
              <p className="font-semibold">{tab.text}</p>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={`tab-content-${tab.value}`}
            className="w-full"
            value={tab.value}
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
