import { type Form } from "./custom-chat-form";
import { FormInput } from "~/components/_primitives/form/form-input";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { MaybeBasicTooltip } from "~/components/_primitives/ui/basic-tooltip";
import { api } from "~/trpc/react";

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
      <MaybeBasicTooltip content="性別を選択してください" enabled={!gender}>
        <Button
          variant="secondary"
          disabled={!gender}
          onClick={async (e) => {
            // TODO: why does not putting these cause a redirect?
            e.preventDefault();
            e.stopPropagation();
            const name = await nameQuery.refetch();
            name.data && form.setValue("name", name.data.name);
          }}
        >
          名前を生成する
        </Button>
      </MaybeBasicTooltip>
    </div>
  );
}
