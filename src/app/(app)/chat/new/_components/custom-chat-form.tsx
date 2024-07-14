"use client";

import { NamePicker } from "./name-picker";
import { useRouter } from "next/navigation";
import { type UseFormReturn, type SubmitHandler } from "react-hook-form";
import { type z } from "zod";
import { BasicForm } from "~/components/_primitives/form/basic-form";
import { FormCombobox } from "~/components/_primitives/form/form-combobox";
import { FormInput } from "~/components/_primitives/form/form-input";
import {
  FormSelect,
  FormSelectOption,
} from "~/components/_primitives/form/form-select";
import { FormTextArea } from "~/components/_primitives/form/form-textarea";
import { useZodForm } from "~/components/_primitives/form/use-zod-form";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { type OptionWithHeading } from "~/components/_primitives/shadcn-raw/combobox";
import { createChatPartnerSchemaClient } from "~/server/api/chat/create-chat";
import {
  formalities,
  formalityStringFromOption,
  type FormalityOption,
} from "~/server/db/schema/chat-partners";
import { api } from "~/trpc/react";

const originOptions: Array<OptionWithHeading> = [
  { heading: "北海道 (Hokkaido)", value: "札幌", label: "札幌 (Sapporo)" },
  { heading: "北海道 (Hokkaido)", value: "旭川", label: "旭川 (Asahikawa)" },
  { heading: "北海道 (Hokkaido)", value: "函館", label: "函館 (Hakodate)" },
  { heading: "東北地方 (Tohoku)", value: "青森", label: "青森 (Aomori)" },
  { heading: "東北地方 (Tohoku)", value: "仙台", label: "仙台 (Sendai)" },
  { heading: "東北地方 (Tohoku)", value: "秋田", label: "秋田 (Akita)" },
  { heading: "関東 (Kanto)", value: "東京", label: "東京 (Tokyo)" },
  { heading: "関東 (Kanto)", value: "横浜", label: "横浜 (Yokohama)" },
  { heading: "関東 (Kanto)", value: "千葉", label: "千葉 (Chiba)" },
  { heading: "関東 (Kanto)", value: "埼玉", label: "埼玉 (Saitama)" },
  { heading: "中部地方 (Chubu)", value: "名古屋", label: "名古屋 (Nagoya)" },
  { heading: "中部地方 (Chubu)", value: "新潟", label: "新潟 (Niigata)" },
  { heading: "中部地方 (Chubu)", value: "金沢", label: "金沢 (Kanazawa)" },
  { heading: "中部地方 (Chubu)", value: "静岡", label: "静岡 (Shizuoka)" },
  { heading: "関西 (Kansai)", value: "大阪", label: "大阪 (Osaka)" },
  { heading: "関西 (Kansai)", value: "京都", label: "京都 (Kyoto)" },
  { heading: "関西 (Kansai)", value: "神戸", label: "神戸 (Kobe)" },
  { heading: "関西 (Kansai)", value: "奈良", label: "奈良 (Nara)" },
  { heading: "中国地方 (Chugoku)", value: "広島", label: "広島 (Hiroshima)" },
  { heading: "中国地方 (Chugoku)", value: "岡山", label: "岡山 (Okayama)" },
  { heading: "中国地方 (Chugoku)", value: "松江", label: "松江 (Matsue)" },
  { heading: "四国 (Shikoku)", value: "松山", label: "松山 (Matsuyama)" },
  { heading: "四国 (Shikoku)", value: "高松", label: "高松 (Takamatsu)" },
  { heading: "四国 (Shikoku)", value: "高知", label: "高知 (Kochi)" },
  { heading: "九州 (Kyushu)", value: "福岡", label: "福岡 (Fukuoka)" },
  { heading: "九州 (Kyushu)", value: "熊本", label: "熊本 (Kumamoto)" },
  { heading: "九州 (Kyushu)", value: "長崎", label: "長崎 (Nagasaki)" },
  { heading: "九州 (Kyushu)", value: "鹿児島", label: "鹿児島 (Kagoshima)" },
  { heading: "沖縄 (Okinawa)", value: "那覇", label: "那覇 (Naha)" },
  { heading: "沖縄 (Okinawa)", value: "石垣", label: "石垣 (Ishigaki)" },
];

const formalityOptions: Array<{ value: FormalityOption; label: string }> =
  formalities.map((formality) => ({
    value: formality,
    label: formalityStringFromOption(formality),
  }));

type CreateChatFormSchema = z.infer<typeof createChatPartnerSchemaClient>;

export type Form = UseFormReturn<CreateChatFormSchema>;

export function CreateChatForm() {
  const router = useRouter();

  const form = useZodForm({
    schema: createChatPartnerSchemaClient,
    defaultValues: {
      name: "",
      age: 25,
      gender: "",
      relation: "",
      situation: "",
      formality: "jidou",
      origin: "",
      personality: "",
    },
  });

  const createChatPartnerMutation = api.chat.createChat.useMutation();

  const onSubmit: SubmitHandler<CreateChatFormSchema> = async (values) => {
    const res = await createChatPartnerMutation.mutateAsync(values);

    router.push(`/chat/${res.chatId}`);
  };

  return (
    <div className="w-full">
      <BasicForm
        form={form}
        onSubmit={onSubmit}
        // title="新しいチャットを作成する"
        buttons={
          <div className="w-full">
            <Button type="submit">送信</Button>
          </div>
        }
      >
        <>
          <FormSelect
            control={form.control}
            rootClassName="w-full"
            label="性別"
            {...form.register("gender")}
            placeholder="性別を選択"
          >
            <FormSelectOption value="female">女性</FormSelectOption>
            <FormSelectOption value="male">男性</FormSelectOption>
            <FormSelectOption value="nonbinary">
              ノンバイナリー
            </FormSelectOption>
          </FormSelect>

          <FormInput
            control={form.control}
            rootClassName="w-full"
            label="年齢"
            type="number"
            {...form.register("age", {
              valueAsNumber: true,
              min: 0,
              max: 150,
            })}
          />

          <NamePicker form={form} />

          <FormCombobox
            label="出身"
            control={form.control}
            options={originOptions}
            // rootClassName="w-full" // TODO: why does it not have this?
            placeholder="出身を選択"
            searchPlaceholder="出身を探す"
            {...form.register("origin")}
          />

          <FormTextArea
            control={form.control}
            rootClassName="w-full"
            label="人格"
            placeholder="例: 楽観的でユーモアがある。相手の気持ちに寄り添い、リラックスした会話を提供する。"
            {...form.register("personality")}
          />

          <FormTextArea
            control={form.control}
            rootClassName="w-full"
            label="関係"
            placeholder="例: 義理の父"
            {...form.register("relation")}
          />

          <FormTextArea
            control={form.control}
            rootClassName="w-full"
            label="状況"
            placeholder="例: 家族の集まりで、最近の仕事の進捗について報告し、アドバイスを求める。"
            {...form.register("situation")}
          />

          <FormSelect
            control={form.control}
            rootClassName="w-full"
            label="話し方"
            {...form.register("formality")}
          >
            {formalityOptions.map((option) => (
              <FormSelectOption key={option.value} value={option.value}>
                {option.label}
              </FormSelectOption>
            ))}
          </FormSelect>
        </>
      </BasicForm>
    </div>
  );
}
