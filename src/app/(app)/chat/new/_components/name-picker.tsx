import { FormInput } from "~/components/_primitives/form/form-input";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { api } from "~/trpc/react";
import { type Form } from "./create-chat-form";

type NamePickerProps = {
  form: Form;
};

export function NamePicker({ form }: NamePickerProps) {
  const nameQuery = api.nameGenerator.getName.useQuery(
    { gender: "male" },
    {
      enabled: false,
    },
  );

  console.log("tktk data", nameQuery.data);

  return (
    <div className="flex w-full flex-row items-end gap-2">
      <FormInput
        control={form.control}
        name="name"
        label="Name"
        rootClassName="w-full"
      />
      <Button
        variant="secondary"
        onClick={async () => {
          const name = await nameQuery.refetch();
          name.data && form.setValue("name", name.data.name);
        }}
      >
        Generate Name
      </Button>
    </div>
  );
}
