import { useEffect, useState } from "react";
import { useSavings } from "../context/SavingsProvider";

export function useSpendingAnalyzer() {
  const { expenses } = useSavings();
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    if (expenses.length === 0) {
      setInsights([]);
      return;
    }

    const tips: string[] = [];

    // Average spend detection
    const avg = expenses.reduce((s, e) => s + e.amount, 0) / expenses.length;
    const last = expenses[expenses.length - 1];
    if (last.amount > avg * 1.5) {
      tips.push(`💡 Last expense “${last.title}” seems unusually high compared to your average.`);
    }

    // Category trend detection
    const categories: Record<string, number> = {};
    expenses.forEach((e) => {
      categories[e.title] = (categories[e.title] || 0) + e.amount;
    });

    const overspentCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    if (overspentCategory && overspentCategory[1] > avg * 2) {
      tips.push(`📊 You are spending a lot on “${overspentCategory[0]}” compared to other areas.`);
    }

    setInsights(tips);
  }, [expenses]);

  return insights;
}
