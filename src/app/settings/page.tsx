import { ensureSignedIn } from "~/components/_utils/ensure-signed-in";

export default async function SettingsPage() {
  await ensureSignedIn();

  return <p>Settings</p>;
}
