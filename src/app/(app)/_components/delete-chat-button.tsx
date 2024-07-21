"use client";

import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { api } from "~/trpc/react";

export function DeleteChatButton({ chatId }: { chatId: string }) {
  const router = useRouter();

  const deleteMutation = api.chat.deleteChat.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Button
      className="absolute right-2 top-2 hidden hover:bg-red-500 group-hover:block"
      variant="ghost"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteMutation.mutate({ chatId });
      }}
    >
      {deleteMutation.isPending ? (
        <ReloadIcon className="animate-spin" />
      ) : (
        <TrashIcon />
      )}
    </Button>
  );
}
