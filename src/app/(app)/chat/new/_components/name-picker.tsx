import { useState } from "react";
import { Button } from "~/components/_primitives/ui/button";
import { Input } from "~/components/_primitives/ui/input";
import { api } from "~/trpc/react";

export function NamePicker() {
  const [name, setName] = useState("");
  const nameQuery = api.nameGenerator.getName.useQuery(
    { gender: "male" },
    {
      enabled: false,
    },
  );

  return (
    <div className="flex flex-row gap-2">
      <Input value={name} onChange={(e) => setName(e.target.value)} />
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
