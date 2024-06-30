import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./_primitives/shadcn-raw/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverIconRow,
} from "./_primitives/ui/basic-popover";
import { ExitIcon, GearIcon, PersonIcon } from "@radix-ui/react-icons";

export async function NavBar() {
  const session = await getServerAuthSession();

  const shortUserName = session?.user.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex w-full items-center justify-between bg-accent p-2">
      {/* TODO: update this depending on where we are */}
      <Link href="/">
        <h1 className="text-xl font-bold">Kaiwa</h1>
      </Link>
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarImage src={session?.user.image ?? undefined} />
            <AvatarFallback>{shortUserName}</AvatarFallback>
          </Avatar>
          <PopoverContent>
            <Link href="/profile">
              <PopoverIconRow icon={<PersonIcon />} text="Profile" />
            </Link>
            <Link href="/settings">
              <PopoverIconRow icon={<GearIcon />} text="Settings" />
            </Link>
            <hr />
            <Link href="/api/auth/signout">
              <PopoverIconRow icon={<ExitIcon />} text="Sign out" />
            </Link>
          </PopoverContent>
        </PopoverTrigger>
      </Popover>
    </div>
  );
}
