"use client";

import type { FoodType } from "@/types/domain";
import { FOOD_TYPES, FOOD_TYPE_LABELS } from "@/data/food-types";
import { Button } from "@/components/ui/button";

interface Props {
  selected: FoodType | null;
  onSelect: (food: FoodType | null) => void;
}

export function FoodTagFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-nowrap gap-1.5">
      <Button
        size="sm"
        variant={selected === null ? "default" : "outline"}
        className="shrink-0 rounded-full border-white/10 bg-white/8 text-sm text-stone-100 transition-all duration-200 hover:scale-105 hover:border-amber-200/35 hover:bg-gradient-to-r hover:from-amber-300/20 hover:to-orange-200/10 hover:text-amber-100 hover:shadow-[0_0_12px_rgba(251,191,36,0.22)]"
        onClick={() => onSelect(null)}
      >
        全部
      </Button>
      {FOOD_TYPES.map((food) => (
        <Button
          key={food}
          size="sm"
          variant={selected === food ? "default" : "outline"}
          className="shrink-0 rounded-full border-white/10 bg-white/8 text-sm text-stone-100 transition-all duration-200 hover:scale-105 hover:border-amber-200/35 hover:bg-gradient-to-r hover:from-amber-300/20 hover:to-orange-200/10 hover:text-amber-100 hover:shadow-[0_0_12px_rgba(251,191,36,0.22)]"
          onClick={() => onSelect(selected === food ? null : food)}
        >
          {FOOD_TYPE_LABELS[food]}
        </Button>
      ))}
    </div>
  );
}
