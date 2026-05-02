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
  "平日午餐",
  "平日晚餐",
  "平日深夜",
  "週六午餐",
  "週六晚餐",
  "週六深夜",
  "週日午餐",
  "週日晚餐",
  "週日深夜",
];

const schema = z.object({
  nickname: z.string().min(2, "暱稱至少 2 個字").max(20, "暱稱最多 20 個字"),
  birthDate: z.string().min(1, "請選擇生日"),
  foodPreferences: z.array(z.string()).min(1, "請至少選擇一種食物偏好"),
  preferredArea: z.string().min(1, "請選擇常活動區域"),
  availableSlots: z.array(z.string()).min(1, "請至少選擇一個方便時段"),
  vibePrompt: z.string().min(5, "至少輸入 5 個字").max(200, "最多 200 個字"),
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
    const area = TAIPEI_AREAS.find((item) => item.name === values.preferredArea) ?? TAIPEI_AREAS[0];

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
                <FormLabel className="text-base text-stone-200">暱稱</FormLabel>
                <FormControl>
                  <Input
                    className="h-11 rounded-2xl border-white/10 bg-white/5 px-4 text-base text-stone-50 placeholder:text-stone-500"
                    placeholder="你希望別人怎麼稱呼你？"
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
                <FormLabel className="text-base text-stone-200">生日</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="h-11 rounded-2xl border-white/10 bg-white/5 px-4 text-base text-stone-50"
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
              <FormLabel className="text-base text-stone-200">喜歡的食物</FormLabel>
              <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-3">
                {FOOD_TYPES.map((food) => (
                  <div
                    key={food}
                    className="group flex cursor-pointer items-center gap-2.5 rounded-2xl border border-white/12 bg-black/15 px-3 py-2.5 transition-all duration-200 hover:scale-[1.05] hover:border-amber-200/35 hover:bg-gradient-to-r hover:from-amber-300/18 hover:to-orange-200/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.28)]"
                  >
                    <Checkbox
                      id={`food-${food}`}
                      checked={field.value.includes(food)}
                      className="border-white/45 bg-white/12 data-checked:border-amber-300 data-checked:bg-amber-300"
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, food]);
                        } else {
                          field.onChange(field.value.filter((value) => value !== food));
                        }
                      }}
                    />
                    <label
                      htmlFor={`food-${food}`}
                      className="cursor-pointer text-base font-normal text-stone-200 transition-colors duration-200 group-hover:text-amber-100"
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
              <div id="preferred-area-label" className="text-base text-stone-200">
                常活動區域
              </div>
              <Select name="preferredArea" onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    aria-labelledby="preferred-area-label"
                    className="h-11 w-full rounded-2xl border-white/10 bg-white/5 px-4 text-base text-stone-100"
                  >
                    <SelectValue placeholder="選擇你的常活動區域" />
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
              <FormLabel className="text-base text-stone-200">方便時段</FormLabel>
              <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-3">
                {SLOT_OPTIONS.map((slot) => (
                  <div
                    key={slot}
                    className="group flex cursor-pointer items-center gap-2.5 rounded-2xl border border-white/12 bg-black/15 px-3 py-2.5 transition-all duration-200 hover:scale-[1.05] hover:border-sky-300/30 hover:bg-gradient-to-r hover:from-sky-300/15 hover:to-indigo-300/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.28)]"
                  >
                    <Checkbox
                      id={`slot-${slot}`}
                      checked={field.value.includes(slot)}
                      className="border-white/45 bg-white/12 data-checked:border-sky-400 data-checked:bg-sky-400"
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, slot]);
                        } else {
                          field.onChange(field.value.filter((value) => value !== slot));
                        }
                      }}
                    />
                    <label
                      htmlFor={`slot-${slot}`}
                      className="cursor-pointer text-base font-normal text-stone-200 transition-colors duration-200 group-hover:text-sky-100"
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
              <FormLabel className="text-base text-stone-200">想認識什麼感覺的人</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-28 rounded-[1.4rem] border-white/10 bg-white/5 px-4 py-3 text-base text-stone-100 placeholder:text-stone-500"
                  placeholder="描述你期待的約會氛圍或相處感覺。"
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
          進入地圖
        </Button>
      </form>
    </Form>
  );
}
