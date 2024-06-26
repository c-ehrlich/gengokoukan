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
            <Button type="submit">Submit</Button>
          </div>
        }
      >
        <div className="flex w-full flex-col items-start gap-4">
          <NamePicker form={form} />

          <FormInput
            control={form.control}
            rootClassName="w-full"
            label="Age"
            type="number"
            {...form.register("age")}
          />

          <FormSelect
            control={form.control}
            rootClassName="w-full"
            label="Gender"
            {...form.register("gender")}
            placeholder="Select gender..."
          >
            <FormSelectOption value="female">Female</FormSelectOption>
            <FormSelectOption value="male">Male</FormSelectOption>
            <FormSelectOption value="nonbinary">Nonbinary</FormSelectOption>
          </FormSelect>

          <FormCombobox
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
