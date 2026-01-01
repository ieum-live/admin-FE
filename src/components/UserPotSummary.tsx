import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface UserPotSummaryProps {
    potLevel: number;
    totalCouponsUsed: number;
  }
  
  export function UserPotSummary({ potLevel, totalCouponsUsed }: UserPotSummaryProps) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            🌸 성장 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">현재 꽃송이</span>
            <span className="font-semibold">🌸 {potLevel.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">총 쿠폰 사용</span>
            <span className="font-semibold">🎟️ {totalCouponsUsed.toLocaleString()}회</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  