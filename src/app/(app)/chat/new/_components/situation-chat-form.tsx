import {
  CoffeeIcon,
  ConciergeBellIcon,
  GuitarIcon,
  HandPlatterIcon,
  MapIcon,
  PlaneTakeoffIcon,
  ShoppingBagIcon,
  SpeechIcon,
} from "lucide-react";

type SituationChat = {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string;
};

const SITUATION_CHAT_ICON_CLASS_NAME = "w-12 h-12";
const SituationChats: SituationChat[] = [
  {
    title: "レストラン",
    description: "食事を頼んで、店員さんとの会話を楽しもう！",
    icon: <HandPlatterIcon className={SITUATION_CHAT_ICON_CLASS_NAME} />,
    value: "restaurant",
  },
  {
    title: "買い物",
    description:
      "お店で商品を見たり、店員さんとやり取りをしたりするシチュエーション。",
    icon: <ShoppingBagIcon className={SITUATION_CHAT_ICON_CLASS_NAME} />,
    value: "shopping",
  },
  {
    title: "旅行の計画",
    description:
      "旅行の行き先やスケジュールを考えたり、準備を進めたりするシチュエーション。",
    icon: <PlaneTakeoffIcon className={SITUATION_CHAT_ICON_CLASS_NAME} />,
    value: "trip-planning",
  },
  {
    title: "初対面",
    description: "新しい人と出会い、自己紹介や会話を楽しむシチュエーション。",
    icon: <SpeechIcon className={SITUATION_CHAT_ICON_CLASS_NAME} />,
    value: "first-meeting",
  },
  {
    title: "道案内を求める",
    description:
      "目的地に行くために、通りすがりの人に道を尋ねるシチュエーション。",
    icon: <MapIcon className={SITUATION_CHAT_ICON_CLASS_NAME} />,
    value: "asking-for-directions",
  },
  {
    title: "ホテル予約",
    description: "ホテルに電話やオンラインで予約をするシチュエーション。",
    icon: <ConciergeBellIcon className={SITUATION_CHAT_ICON_CLASS_NAME} />,
    value: "hotel-reservation",
  },
  {
    title: "趣味について話す",
    description: "自分や相手の趣味について語り合うシチュエーション。",
    icon: <GuitarIcon className={SITUATION_CHAT_ICON_CLASS_NAME} />,
    value: "talking-about-hobbies",
  },
  {
    title: "カフェで",
    description:
      "カフェで友達とおしゃべりしたり、店員さんに注文したりするシチュエーション。",
    icon: <CoffeeIcon className={SITUATION_CHAT_ICON_CLASS_NAME} />,
    value: "at-a-cafe",
  },
];
export function SituationChatForm() {
  return (
    <div className="grid w-full grid-cols-2 gap-2">
      {SituationChats.map((situationChat) => (
        <SituationChatCard key={situationChat.value} {...situationChat} />
      ))}
    </div>
  );
}

function SituationChatCard({ title, description, icon, value }: SituationChat) {
  return (
    <div className="flex flex-row gap-3 rounded-lg bg-chatbubble p-4 shadow-lg">
      {icon}
      <div className="flex w-full flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
