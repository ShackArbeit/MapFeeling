import type { UserProfile } from "@/types/domain";
import { FOOD_TYPE_LABELS } from "@/data/food-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  user: UserProfile;
  viewerProfile: UserProfile | null;
}

export function CandidateCard({ user, viewerProfile: _ }: Props) {
  return (
    <Card className="mx-4 mt-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.nickname}
            className="w-14 h-14 rounded-full border-2 border-orange-200 bg-gray-100"
          />
          <div>
            <CardTitle className="text-base">{user.nickname}</CardTitle>
            <CardDescription>
              {user.preferredArea} · {user.zodiacSign}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700">{user.bio}</p>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">食物喜好</p>
          <div className="flex flex-wrap gap-1">
            {user.foodPreferences.map((food) => (
              <Badge key={food} variant="secondary" className="text-xs">
                {FOOD_TYPE_LABELS[food]}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">約會心情</p>
          <p className="text-sm italic text-gray-600">"{user.vibePrompt}"</p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">可約時段</p>
          <div className="flex flex-wrap gap-1">
            {user.availableSlots.map((slot) => (
              <Badge key={slot} variant="outline" className="text-xs">
                {slot}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground border-t pt-2">{user.safetyNote}</p>

        <Button className="w-full" size="sm">
          產生邀約建議
        </Button>
      </CardContent>
    </Card>
  );
}
