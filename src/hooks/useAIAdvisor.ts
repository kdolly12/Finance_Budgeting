import { useGoalTracker } from "./useGoalTracker";
import { useSavingsCoach } from "./useSavingsCoach";
import { useSpendingAnalyzer } from "./useSpendingAnalyzer";
import { useSavings } from "../context/SavingsProvider";
import { useMemo } from "react";
import './AIAdvisor.css';

// Define a tip type with priority
type Tip = {
  text: string;
  priority: 1 | 2 | 3; // 3 = high, 2 = medium, 1 = low
};

export function useAIAdvisor() {
  const { goal, expenses } = useSavings();
  const goalTips = useGoalTracker();
  const coachTips = useSavingsCoach();
  const spendingTips = useSpendingAnalyzer();

  const aiTips = useMemo(() => {
    const combinedTips: Tip[] = [];

    // 🔴 High priority: overspending or unusual expenses
    coachTips.forEach(tip => combinedTips.push({ text: tip, priority: 3 }));
    spendingTips.forEach(tip => combinedTips.push({ text: tip, priority: 3 }));

    // 🟡 Medium priority: goal tracking suggestions
    goalTips.forEach(tip => combinedTips.push({ text: tip, priority: 2 }));

    // 🔵 Low priority: general forecast based on current spending
    if (goal && expenses.length > 0) {
      const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
      const forecast = (totalSpent / expenses.length) * 30; // rough monthly forecast
      const formattedForecast = forecast.toLocaleString("en-IN", { maximumFractionDigits: 0 });
      combinedTips.push({
        text: `📈 Forecast: At current spending, you may spend ₹${formattedForecast} this month.`,
        priority: 1,
      });
    }

    // Sort by priority descending (3 → 1)
    combinedTips.sort((a, b) => b.priority - a.priority);

    // Return only the text for display
    return combinedTips.map(tip => tip.text);
  }, [goalTips, coachTips, spendingTips, goal, expenses]);

  return aiTips;
}
