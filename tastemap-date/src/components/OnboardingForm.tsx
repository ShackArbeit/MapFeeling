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
import type { UserProfile, FoodType } from "@/types/domain";

const SLOT_OPTIONS = [
  "週一晚上", "週二晚上", "週三晚上", "週四晚上", "週五晚上",
  "週六中午", "週六晚上", "週日中午", "週日晚上",
];

const schema = z.object({
  nickname: z.string().min(2, "暱稱至少 2 個字").max(20, "暱稱最多 20 個字"),
  birthDate: z.string().min(1, "請選擇生日"),
  foodPreferences: z.array(z.string()).min(1, "請至少選擇一種食物偏好"),
  preferredArea: z.string().min(1, "請選擇約會區域"),
  availableSlots: z.array(z.string()).min(1, "請至少選擇一個可約時段"),
  vibePrompt: z
    .string()
    .min(5, "請寫至少 5 個字")
    .max(200, "最多 200 個字"),
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
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>暱稱</FormLabel>
              <FormControl>
                <Input placeholder="例：抹茶控、拉麵狂人" {...field} />
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
              <FormLabel>生日</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="foodPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>食物偏好（可多選）</FormLabel>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {FOOD_TYPES.map((food) => (
                  <div key={food} className="flex items-center gap-2">
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
                      className="text-sm font-normal cursor-pointer"
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
              <FormLabel>偏好約會區域</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇區域" />
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
              <FormLabel>可約時段（可多選）</FormLabel>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {SLOT_OPTIONS.map((slot) => (
                  <div key={slot} className="flex items-center gap-2">
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
                      className="text-sm font-normal cursor-pointer"
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
              <FormLabel>約會心情描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="描述你的約會期待，例：想找個週末一起去試新餐廳的人..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg">
          探索食感地圖
        </Button>
      </form>
    </Form>
  );
}
