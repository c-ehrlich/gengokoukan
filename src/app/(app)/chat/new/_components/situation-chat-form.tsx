import Image, { StaticImageData } from "next/image";
import cafe from "../_assets/cafe.jpg";
import directions from "../_assets/directions.jpg";
import guitar from "../_assets/guitar.jpg";
import hotel from "../_assets/hotel.jpg";
import party from "../_assets/party.jpg";
import planningTrip from "../_assets/planning-trip.jpg";
import restaurant from "../_assets/restaurant.jpg";
import shopping from "../_assets/shopping.jpg";

type SituationChat = {
  title: string;
  description: string;
  image: StaticImageData;
  value: string;
};

const SITUATION_CHAT_ICON_CLASS_NAME = "w-12 h-12";
const SituationChats: SituationChat[] = [
  {
    title: "レストラン",
    description: "食事を頼んで、店員さんとの会話を楽しもう！",
    image: restaurant,
    value: "restaurant",
  },
  {
    title: "買い物",
    description:
      "お店で商品を見たり、店員さんとやり取りをしたりするシチュエーション。",
    image: shopping,
    value: "shopping",
  },
  {
    title: "旅行の計画",
    description:
      "旅行の行き先やスケジュールを考えたり、準備を進めたりするシチュエーション。",
    image: planningTrip,
    value: "trip-planning",
  },
  {
    title: "初対面",
    description: "新しい人と出会い、自己紹介や会話を楽しむシチュエーション。",
    image: party,
    value: "first-meeting",
  },
  {
    title: "道案内を求める",
    description:
      "目的地に行くために、通りすがりの人に道を尋ねるシチュエーション。",
    image: directions,
    value: "asking-for-directions",
  },
  {
    title: "ホテル予約",
    description: "ホテルに電話やオンラインで予約をするシチュエーション。",
    image: hotel,
    value: "hotel-reservation",
  },
  {
    title: "趣味について話す",
    description: "自分や相手の趣味について語り合うシチュエーション。",
    image: guitar,
    value: "talking-about-hobbies",
  },
  {
    title: "カフェで",
    description:
      "カフェで友達とおしゃべりしたり、店員さんに注文したりするシチュエーション。",
    image: cafe,
    value: "at-a-cafe",
  },
];
export function SituationChatForm() {
  return (
    <div className="grid w-full grid-cols-3 gap-2">
      {SituationChats.map((situationChat) => (
        <SituationChatCard key={situationChat.value} {...situationChat} />
      ))}
    </div>
  );
}

function SituationChatCard({
  title,
  description,
  image,
  value,
}: SituationChat) {
  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg bg-chatbubble p-2 pb-3 shadow-lg">
      <div className="aspect-3/2 relative overflow-clip rounded-md">
        <Image src={image} alt={title} width={600} height={400} />
        <div className="absolute left-2 top-2 rounded-full bg-green-300 px-4 py-2 shadow-lg">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <p>{description}</p>
      </div>
    </div>
  );
}
