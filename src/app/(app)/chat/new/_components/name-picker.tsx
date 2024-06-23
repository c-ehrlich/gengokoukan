import { useState } from "react";
import { FormInput } from "~/components/_primitives/form/form-input";
import { Button } from "~/components/_primitives/ui/button";
import { api } from "~/trpc/react";

type NamePickerProps = {
  control: any; // TODO: fix
};

export function NamePicker({ control }: NamePickerProps) {
  const [name, setName] = useState("");
  const nameQuery = api.nameGenerator.getName.useQuery(
    { gender: "male" },
    {
      enabled: false,
    },
  );

  return (
    <div className="flex flex-row gap-2">
      <FormInput control={control} name={name} />
      <Button
        variant="secondary"
        onClick={async () => {
          const name = await nameQuery.refetch();
          name.data && setName(name.data.name);
        }}
      >
        Generate Name
      </Button>
    </div>
  );
}
