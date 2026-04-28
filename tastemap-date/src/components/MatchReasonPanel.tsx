import type { UserProfile } from "@/types/domain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  user: UserProfile;
  viewerProfile: UserProfile | null;
}

export function MatchReasonPanel({ user: _, viewerProfile: __ }: Props) {
  return (
    <Card className="mx-4 mb-4">
      <CardHeader>
        <CardTitle className="text-sm">配對評分</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-orange-500 text-center py-2">
          85 分
        </div>
        <p className="text-xs text-muted-foreground text-center">
          完整配對分析將在 Phase 2 啟用
        </p>
      </CardContent>
    </Card>
  );
}
