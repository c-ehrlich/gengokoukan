"use client";

import { type UseFormReturn, type SubmitHandler } from "react-hook-form";
import { type z } from "zod";
import { BasicForm } from "~/components/_primitives/form/basic-form";
import { FormCombobox } from "~/components/_primitives/form/form-combobox";
import { useZodForm } from "~/components/_primitives/form/use-zod-form";
import { createChatPartnerSchemaClient } from "~/server/db/schema/chat-partners.zod";
import { NamePicker } from "./name-picker";
import { FormInput } from "~/components/_primitives/form/form-input";
import { FormTextArea } from "~/components/_primitives/form/form-textarea";
import {
  FormSelect,
  FormSelectOption,
} from "~/components/_primitives/form/form-select";
import { api } from "~/trpc/react";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { useRouter } from "next/navigation";

const originOptions = [
  { value: "earth", label: "Earth" },
  { value: "mars", label: "Mars" },
  { value: "moon", label: "Moon" },
  { value: "jupiter", label: "Jupiter" },
];

/**
北海道・札幌（Sapporo）
北海道・旭川（Asahikawa）
北海道・函館（Hakodate）
Tōhoku Region
東北地方・青森（Aomori）
東北地方・仙台（Sendai）
東北地方・秋田（Akita）
Kantō Region
関東・Tokyo (東京)
関東・Yokohama (横浜)
関東・Chiba (千葉)
関東・Saitama (埼玉)
Chūbu Region
中部地方・Nagoya (名古屋)
中部地方・Niigata (新潟)
中部地方・Kanazawa (金沢)
中部地方・Shizuoka (静i岡)
Kansai Region
関西・Osaka (大阪)
関西・Kyoto (京都)
関西・Kobe (神戸)
関西・Nara (奈良)
Chūgoku Region
中国地方・Hiroshima (広島)
中国地方・Okayama (岡山)
中国地方・Matsue (松江)
Shikoku Region
四国・Matsuyama (松山)
四国・Takamatsu (高松)
四国・Kochi (高知)
Kyūshū Region
九州・Fukuoka (福岡)
九州・Kumamoto (熊本)
九州・Nagasaki (長崎)
九州・Kagoshima (鹿児島)
Okinawa Region
沖縄・Naha (那覇)
 */

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
      interests: "",
      origin: "",
      personality: "",
    },
  });

  const createChatPartnerMutation = api.chat.createChat.useMutation();

  const onSubmit: SubmitHandler<CreateChatFormSchema> = async (values) => {
    const res = await createChatPartnerMutation.mutateAsync(values);

    console.log("tktk res", res);

    router.push(`/chat/${res.chatId}`);
  };

  return (
    <div className="w-full p-4">
      <BasicForm
        form={form}
        onSubmit={onSubmit}
        buttons={
          <div className="w-full">
            <Button type="submit">送信</Button>
          </div>
        }
      >
        <div className="flex w-full flex-col items-start gap-4">
          <NamePicker form={form} />

          <FormInput
            control={form.control}
            rootClassName="w-full"
            label="年齢"
            type="number"
            {...form.register("age")}
          />

          <FormSelect
            control={form.control}
            rootClassName="w-full"
            label="性別"
            {...form.register("gender")}
            placeholder="性別を選択"
          >
            <FormSelectOption value="female">男性</FormSelectOption>
            <FormSelectOption value="male">女性</FormSelectOption>
            <FormSelectOption value="nonbinary">
              ノンバイナリー
            </FormSelectOption>
          </FormSelect>

          <FormCombobox
            label="出身"
            control={form.control}
            options={originOptions}
            // rootClassName="w-full" // TODO: why does it not have this?
            placeholder="Select origin"
            searchPlaceholder="Search origin"
            {...form.register("origin")}
          />

          <FormTextArea
            control={form.control}
            rootClassName="w-full"
            label="Personality"
            placeholder="Personality placeholder"
            {...form.register("personality")}
          />

          <FormTextArea
            control={form.control}
            rootClassName="w-full"
            label="Interests"
            placeholder="Interests placeholder"
            {...form.register("interests")}
          />
        </div>
      </BasicForm>
    </div>
  );
}
