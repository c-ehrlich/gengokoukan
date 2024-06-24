import { ensureSignedIn } from "~/components/_utils/ensure-signed-in";

export default async function ProfilePage() {
  await ensureSignedIn();

  return <p>Profile</p>;
}
