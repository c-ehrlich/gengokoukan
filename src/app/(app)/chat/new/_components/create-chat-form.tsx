"use client";

import { type SubmitHandler } from "react-hook-form";
import { type z } from "zod";
import { BasicForm } from "~/components/_primitives/form/basic-form";
import { FormCombobox } from "~/components/_primitives/form/form-combobox";
import { useZodForm } from "~/components/_primitives/form/use-zod-form";
import { createChatPartnerSchemaClient } from "~/server/db/schema/chat-partners.zod";

const originOptions = [
  { value: "earth", label: "Earth" },
  { value: "mars", label: "Mars" },
  { value: "moon", label: "Moon" },
  { value: "jupiter", label: "Jupiter" },
];

type CreateChatFormSchema = z.infer<typeof createChatPartnerSchemaClient>;

export function CreateChatForm() {
  const form = useZodForm({
    schema: createChatPartnerSchemaClient,
    defaultValues: {
      name: "",
      age: 25,
      interests: "",
      origin: "",
      personality: "",
    },
  });

  const onSubmit: SubmitHandler<CreateChatFormSchema> = async (values) => {
    console.log(values);
  };

  return (
    <div>
      <BasicForm form={form} onSubmit={onSubmit} buttons={<div />}>
        <FormCombobox
          control={form.control}
          name="origin"
          options={originOptions}
          placeholder="Select origin"
          searchPlaceholder="Search origin"
        />
      </BasicForm>
    </div>
  );
}
