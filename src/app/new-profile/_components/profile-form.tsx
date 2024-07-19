"use client";

import { useZodForm } from "~/components/_primitives/form/use-zod-form";
import { type UserProfileTableRow } from "~/server/db/schema/user-profiles";
import { api } from "~/trpc/react";

export function ProfileForm({ profile }: { profile?: UserProfileTableRow }) {
  const profileQuery = api.user.getProfile.useQuery(undefined, {
    staleTime: Infinity,
    initialData: profile,
  });

  const isInitial = !profile;

  // TODO: build this form
  const profileForm = useZodForm({
    schema: undefined,
  });

  return (
    <div>
      <pre>profile: {JSON.stringify(profileQuery.data, null, 2)}</pre>
    </div>
  );
}
