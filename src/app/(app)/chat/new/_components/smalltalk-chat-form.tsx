"use client";

import { useRouter } from "next/navigation";
import { type SubmitHandler } from "react-hook-form";
import { BasicForm } from "~/components/_primitives/form/basic-form";
import { FormInput } from "~/components/_primitives/form/form-input";
import {
  FormSelect,
  FormSelectOption,
} from "~/components/_primitives/form/form-select";
import { useZodForm } from "~/components/_primitives/form/use-zod-form";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import {
  type CreateChatSmalltalkSchema,
  createChatSmalltalkSchema,
} from "~/server/api/chat/create-chat-smalltalk.schema";
import { api } from "~/trpc/react";

export function SmalltalkChatForm() {
  const router = useRouter();

  const smalltalkChatForm = useZodForm({
    schema: createChatSmalltalkSchema,
    defaultValues: {
      relation: "",
      topic: "",
    },
  });

  const smalltalkChatMutation = api.chat.createChatSmalltalk.useMutation();

  const onSubmit: SubmitHandler<CreateChatSmalltalkSchema> = async (values) => {
    const res = await smalltalkChatMutation.mutateAsync(values);

    router.push(`/chat/${res.chatId}`);
  };

  return (
    <div className="w-full p-4">
      <BasicForm
        form={smalltalkChatForm}
        onSubmit={onSubmit}
        title="フリートークを開始する"
        buttons={
          <div className="w-full">
            <Button type="submit">送信</Button>
          </div>
        }
      >
        <FormSelect
          label="関係"
          control={smalltalkChatForm.control}
          name="relation"
        >
          <FormSelectOption value="family">家族</FormSelectOption>
          <FormSelectOption value="friend">友達</FormSelectOption>
          <FormSelectOption value="acquaintance">友人</FormSelectOption>
        </FormSelect>

        <FormInput
          label="トピック"
          control={smalltalkChatForm.control}
          name="topic"
          placeholder="好きな本など"
        />
      </BasicForm>
    </div>
  );
}
