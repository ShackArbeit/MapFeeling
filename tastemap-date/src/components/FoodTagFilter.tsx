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
    <div className="flex gap-1.5 flex-nowrap">
      <Button
        size="sm"
        variant={selected === null ? "default" : "outline"}
        className="shrink-0"
        onClick={() => onSelect(null)}
      >
        全部
      </Button>
      {FOOD_TYPES.map((food) => (
        <Button
          key={food}
          size="sm"
          variant={selected === food ? "default" : "outline"}
          className="shrink-0"
          onClick={() => onSelect(selected === food ? null : food)}
        >
          {FOOD_TYPE_LABELS[food]}
        </Button>
      ))}
    </div>
  );
}
