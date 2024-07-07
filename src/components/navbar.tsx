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
import { MessagesSquareIcon } from "lucide-react";

export async function NavBar() {
  const session = await getServerAuthSession();

  const shortUserName = session?.user.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex w-full items-center justify-between bg-chatbubble px-4 py-1 shadow-inner">
      {/* TODO: update this depending on where we are */}
      <Link href="/">
        <div className="flex flex-row items-center gap-2">
          <MessagesSquareIcon strokeWidth={3} />
          <h1 className="text-2xl font-bold">kaiwa.club</h1>
        </div>
      </Link>
      <Popover>
        <PopoverTrigger>
          <div className="cursor-pointer rounded-full border border-accent bg-chatbubble p-0.5 shadow-md hover:bg-chat">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session?.user.image ?? undefined} />
              <AvatarFallback>{shortUserName}</AvatarFallback>
            </Avatar>
          </div>
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
