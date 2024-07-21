import { ProfileForm } from "./_components/profile-form";
import { NavBar } from "~/components/navbar";
import { api } from "~/trpc/server";

export default async function ProfilePage() {
  const profile = await api.user.getProfile();

  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center">
        <NavBar />

        <div className="h-full w-full">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </>
  );
}
