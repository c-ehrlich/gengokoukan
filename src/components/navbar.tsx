import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./_primitives/shadcn-raw/avatar";

export async function NavBar() {
  const session = await getServerAuthSession();

  const shortUserName = session?.user.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex w-full items-center justify-between bg-muted p-2">
      <p>foo</p>
      <Avatar>
        <AvatarImage src={session?.user.image ?? undefined} />
        <AvatarFallback>{shortUserName}</AvatarFallback>
      </Avatar>
    </div>
  );
}
