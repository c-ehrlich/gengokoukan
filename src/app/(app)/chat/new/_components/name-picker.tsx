import { FormInput } from "~/components/_primitives/form/form-input";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { api } from "~/trpc/react";
import { type Form } from "./create-chat-form";

type NamePickerProps = {
  form: Form;
};

export function NamePicker({ form }: NamePickerProps) {
  const gender = form.watch("gender");

  const nameQuery = api.nameGenerator.getName.useQuery(
    { gender: gender },
    {
      enabled: false,
    },
  );

  return (
    <div className="flex w-full flex-row items-end gap-2">
      <FormInput
        control={form.control}
        name="name"
        label="名前"
        rootClassName="w-full"
      />
      <Button
        variant="secondary"
        onClick={async () => {
          const name = await nameQuery.refetch();
          name.data && form.setValue("name", name.data.name);
        }}
      >
        名前を生成する
      </Button>
    </div>
  );
}
