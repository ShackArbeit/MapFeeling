"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FOOD_TYPES, FOOD_TYPE_LABELS } from "@/data/food-types";
import { TAIPEI_AREAS } from "@/data/taipei-districts";
import { calculateZodiac } from "@/features/zodiac/zodiac";
import type { FoodType, UserProfile } from "@/types/domain";

const SLOT_OPTIONS = [
  "週一晚上",
  "週二晚上",
  "週三晚上",
  "週四晚上",
  "週五晚上",
  "週六中午",
  "週六晚上",
  "週日中午",
  "週日晚上",
];

const schema = z.object({
  nickname: z.string().min(2, "暱稱至少 2 個字").max(20, "暱稱最多 20 個字"),
  birthDate: z.string().min(1, "請填寫生日"),
  foodPreferences: z.array(z.string()).min(1, "請至少選擇一種飲食偏好"),
  preferredArea: z.string().min(1, "請選擇常活動區域"),
  availableSlots: z.array(z.string()).min(1, "請至少選擇一個可約時間"),
  vibePrompt: z.string().min(5, "請至少輸入 5 個字").max(200, "最多 200 個字"),
});

type FormValues = z.infer<typeof schema>;

export function OnboardingForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nickname: "",
      birthDate: "",
      foodPreferences: [],
      preferredArea: "",
      availableSlots: [],
      vibePrompt: "",
    },
  });

  function onSubmit(values: FormValues) {
    const { zodiacSign, zodiacElement } = calculateZodiac(values.birthDate);
    const area =
      TAIPEI_AREAS.find((a) => a.name === values.preferredArea) ??
      TAIPEI_AREAS[0];

    const profile: UserProfile = {
      id: "viewer",
      nickname: values.nickname,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=viewer_${encodeURIComponent(values.nickname)}`,
      birthDate: values.birthDate,
      zodiacSign,
      zodiacElement,
      bio: "",
      vibePrompt: values.vibePrompt,
      foodPreferences: values.foodPreferences as FoodType[],
      preferredArea: values.preferredArea,
      availableSlots: values.availableSlots,
      lat: area.lat,
      lng: area.lng,
      locationPrecision: "area",
      safetyNote: "",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("tastemap.viewerProfile", JSON.stringify(profile));
    router.push("/map");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-stone-200">暱稱</FormLabel>
                <FormControl>
                  <Input
                    className="h-11 rounded-2xl border-white/10 bg-white/5 px-4 text-stone-50 placeholder:text-stone-500"
                    placeholder="例如：深夜拉麵巡航員"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-stone-200">生日</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="h-11 rounded-2xl border-white/10 bg-white/5 px-4 text-stone-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="foodPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-stone-200">你最常想吃什麼</FormLabel>
              <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-3">
                {FOOD_TYPES.map((food) => (
                  <div
                    key={food}
                    className="flex items-center gap-2 rounded-2xl border border-white/8 bg-black/15 px-3 py-2.5"
                  >
                    <Checkbox
                      id={`food-${food}`}
                      checked={field.value.includes(food)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, food]);
                        } else {
                          field.onChange(field.value.filter((v) => v !== food));
                        }
                      }}
                    />
                    <label
                      htmlFor={`food-${food}`}
                      className="cursor-pointer text-sm font-normal text-stone-300"
                    >
                      {FOOD_TYPE_LABELS[food]}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-stone-200">常活動區域</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/5 px-4 text-stone-100">
                    <SelectValue placeholder="選擇一個區域" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TAIPEI_AREAS.map((area) => (
                    <SelectItem key={area.name} value={area.name}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availableSlots"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-stone-200">你通常什麼時候方便</FormLabel>
              <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-3">
                {SLOT_OPTIONS.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center gap-2 rounded-2xl border border-white/8 bg-black/15 px-3 py-2.5"
                  >
                    <Checkbox
                      id={`slot-${slot}`}
                      checked={field.value.includes(slot)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, slot]);
                        } else {
                          field.onChange(field.value.filter((v) => v !== slot));
                        }
                      }}
                    />
                    <label
                      htmlFor={`slot-${slot}`}
                      className="cursor-pointer text-sm font-normal text-stone-300"
                    >
                      {slot}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vibePrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-stone-200">想認識什麼感覺的人</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-28 rounded-[1.4rem] border-white/10 bg-white/5 px-4 py-3 text-stone-100 placeholder:text-stone-500"
                  placeholder="例如：可以一起散步、聊天不急、喜歡找有氣氛的小店。"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-12 w-full rounded-full bg-amber-300 text-slate-950 hover:bg-amber-200"
          size="lg"
        >
          完成並進入地圖
        </Button>
      </form>
    </Form>
  );
}
