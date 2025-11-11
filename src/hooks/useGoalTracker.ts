import { useEffect, useState } from "react";
import { useSavings } from "../context/SavingsProvider";

export function useGoalTracker() {
  const { goal, expenses } = useSavings();
  const [progressTips, setProgressTips] = useState<string[]>([]);

  useEffect(() => {
    if (!goal) {
      setProgressTips([]);
      return;
    }

    const monthlyLimit = goal.amount / goal.durationMonths;
    const monthlySpent = expenses
      .filter((e) => e.type === "monthly")
      .reduce((sum, e) => sum + e.amount, 0);

    const progress = (monthlySpent / monthlyLimit) * 100;
    const tips: string[] = [];

    tips.push(`📈 Progress: ${progress.toFixed(1)}% of this month’s budget used.`);

    if (progress > 80) {
      tips.push("⚠️ You’re close to exhausting this month’s budget. Slow down on spending.");
    } else if (progress < 40) {
      tips.push("🎯 Great job! You’re well within this month’s budget.");
    }

    setProgressTips(tips);
  }, [goal, expenses]);

  return progressTips;
}
