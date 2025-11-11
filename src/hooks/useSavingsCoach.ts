import { useEffect, useState } from "react";
import { useSavings } from "../context/SavingsProvider";

export function useSavingsCoach() {
  const { goal, expenses } = useSavings();
  const [coachTips, setCoachTips] = useState<string[]>([]);

  useEffect(() => {
    if (!goal) {
      setCoachTips([]);
      return;
    }

    const monthlyLimit = goal.amount / goal.durationMonths;
    const dailyLimit = monthlyLimit / 30;

    const monthlySpent = expenses
      .filter((e) => e.type === "monthly")
      .reduce((sum, e) => sum + e.amount, 0);

    const dailySpent = expenses
      .filter((e) => e.type === "daily")
      .reduce((sum, e) => sum + e.amount, 0);

    const tips: string[] = [];

    if (monthlySpent > monthlyLimit) {
      tips.push("⚠️ You’ve exceeded your monthly budget!");
    } else {
      tips.push(`✅ Within monthly budget. ₹${(monthlyLimit - monthlySpent).toFixed(0)} left.`);
    }

    if (dailySpent > dailyLimit) {
      tips.push("⚠️ Today’s spending crossed the daily limit.");
    }

    setCoachTips(tips);
  }, [goal, expenses]);

  return coachTips;
}
