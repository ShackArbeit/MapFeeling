"use client";

import { useState } from "react";
import type { DateRequest, FoodType, UserProfile } from "@/types/domain";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FOOD_TYPE_LABELS, FOOD_TYPES } from "@/data/food-types";
import { TAIPEI_AREAS } from "@/data/taipei-districts";
import { dateRequestService } from "@/features/date-requests/dateRequest.service";

interface Props {
  viewer: UserProfile;
  candidate: UserProfile;
  suggestedMessage: string;
  onSent?: (req: DateRequest) => void;
}

const TIME_SLOTS = [
  "本週末午後",
  "本週末晚上",
  "下週末午後",
  "下週末晚上",
  "平日午後",
  "平日晚上",
];

export function DateRequestDialog({ viewer, candidate, suggestedMessage, onSent }: Props) {
  const [open, setOpen] = useState(false);
  const [foodType, setFoodType] = useState<FoodType>(
    viewer.foodPreferences[0] ?? "coffee"
  );
  const [proposedArea, setProposedArea] = useState(viewer.preferredArea);
  const [proposedTime, setProposedTime] = useState(TIME_SLOTS[0]);
  const [message, setMessage] = useState(suggestedMessage);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      const req = await dateRequestService.create({
        senderId: viewer.id,
        receiverId: candidate.id,
        foodType,
        proposedArea,
        proposedPlaceName: `${proposedArea}附近`,
        proposedTime,
        message,
        aiReason: suggestedMessage,
      });
      setSent(true);
      onSent?.(req);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
      }, 1200);
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="sm" />
        }
      >
        發送邀約
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>邀約 {candidate.nickname}</DialogTitle>
          <DialogDescription>低壓力的第一步，對方可以自由接受或拒絕。</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">想吃什麼</label>
            <Select value={foodType} onValueChange={(v) => { if (v !== null) setFoodType(v as FoodType); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOOD_TYPES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {FOOD_TYPE_LABELS[f]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">約會區域</label>
            <Select value={proposedArea} onValueChange={(v) => { if (v !== null) setProposedArea(v); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TAIPEI_AREAS.map((a) => (
                  <SelectItem key={a.name} value={a.name}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">可約時間</label>
            <Select value={proposedTime} onValueChange={(v) => { if (v !== null) setProposedTime(v); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">邀約訊息</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="寫下你想說的話…"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={sending}>
            取消
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleSend}
            disabled={sending || sent || !message.trim()}
          >
            {sent ? "已送出 ✓" : sending ? "送出中…" : "確認送出"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}