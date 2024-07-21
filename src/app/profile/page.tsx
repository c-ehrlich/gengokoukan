import { ProfileForm } from "./_components/profile-form";
import { api } from "~/trpc/server";

export default async function ProfilePage() {
  const profile = await api.user.getProfile();

  return <ProfileForm profile={profile} />;
}
