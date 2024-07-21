"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type SubmitHandler } from "react-hook-form";
import { BasicForm } from "~/components/_primitives/form/basic-form";
import { FormInput } from "~/components/_primitives/form/form-input";
import {
  FormSelect,
  FormSelectOption,
} from "~/components/_primitives/form/form-select";
import { FormTextArea } from "~/components/_primitives/form/form-textarea";
import { useZodForm } from "~/components/_primitives/form/use-zod-form";
import { Button } from "~/components/_primitives/shadcn-raw/button";
import { Calendar } from "~/components/_primitives/shadcn-raw/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/_primitives/shadcn-raw/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/_primitives/shadcn-raw/popover";
import { Toaster } from "~/components/_primitives/shadcn-raw/toaster";
import { useToast } from "~/components/_primitives/shadcn-raw/use-toast";
import { cn } from "~/components/_utils/cn";
import {
  type CreateEditProfileSchema,
  createEditProfileSchema,
} from "~/server/api/user/create-profile.schema";
import { type UserProfileTableRow } from "~/server/db/schema/user-profiles";
import { api } from "~/trpc/react";

export function ProfileForm({ profile }: { profile?: UserProfileTableRow }) {
  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useUtils();

  const profileQuery = api.user.getProfile.useQuery(undefined, {
    initialData: profile,
  });

  const isInitial = !profile;

  const profileForm = useZodForm({
    schema: createEditProfileSchema,
    // @ts-expect-error TODO: undefined/null
    defaultValues: isInitial ? {} : profileQuery.data,
  });

  const createProfileMutation = api.user.createProfile.useMutation({
    onSuccess: async () => {
      toast({
        title: "プロフィールを作成しました",
      });
    },
  });

  const handleCreate: SubmitHandler<CreateEditProfileSchema> = async (data) => {
    await createProfileMutation.mutateAsync(data);

    router.push("/");
  };

  const editProfileMutation = api.user.editProfile.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();

      toast({
        title: "プロフィールを編集しました",
      });
    },
  });

  const handleEdit: SubmitHandler<CreateEditProfileSchema> = async (data) => {
    await editProfileMutation.mutateAsync(data);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      {isInitial ? (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">会話クラブへようこそ</h1>
          <p>プロフィールを作成しよう</p>
        </div>
      ) : (
        <h1 className="text-2xl font-semibold">プロフィールを編集する</h1>
      )}
      {/* TODO: put the toaster further up */}
      <Toaster />
      <BasicForm
        form={profileForm}
        onSubmit={isInitial ? handleCreate : handleEdit}
        buttons={
          <div className="flex items-center">
            <Button type="submit">送信</Button>
          </div>
        }
      >
        <div className="flex w-full flex-col gap-4">
          <FormInput control={profileForm.control} name="name" label="名前" />
          <FormSelect
            control={profileForm.control}
            label="性別"
            {...profileForm.register("gender")}
          >
            <FormSelectOption value="female">女性</FormSelectOption>
            <FormSelectOption value="male">男性</FormSelectOption>
            <FormSelectOption value="nonbinary">
              ノンバイナリー
            </FormSelectOption>
          </FormSelect>
          <FormField
            control={profileForm.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>生年月日</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          // "w-[240px]",
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>生年月日を選択</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      // initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormInput
            control={profileForm.control}
            name="location"
            label="所在地"
          />
          <FormTextArea
            control={profileForm.control}
            name="interests"
            label="興味・好き"
          />
          <FormSelect
            control={profileForm.control}
            name="jlptLevel"
            label="日本語能力"
          >
            <FormSelectOption value="N1+">N1合格</FormSelectOption>
            <FormSelectOption value="N1">N1目標</FormSelectOption>
            <FormSelectOption value="N2">N2目標</FormSelectOption>
            <FormSelectOption value="N3">N3目標</FormSelectOption>
            <FormSelectOption value="N4">N4目標</FormSelectOption>
            <FormSelectOption value="N5">N5目標</FormSelectOption>
          </FormSelect>
          <FormTextArea
            control={profileForm.control}
            name="goals"
            label="目標"
          />
        </div>
      </BasicForm>
    </div>
  );
}
