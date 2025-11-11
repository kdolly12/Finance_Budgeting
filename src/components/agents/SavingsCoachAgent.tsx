// components/agents/SavingsCoachAgent.tsx
import { useSavings } from "../../context/SavingsProvider";

export default function SavingsCoachAgent() {
  const { goal, expenses } = useSavings();
  if (!goal) return null;

  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const savedSoFar = goal.amount - spent;

  const today = new Date();
  const target = new Date();
  target.setMonth(target.getMonth() + goal.durationMonths);
  const remainingDays = Math.max(
    1,
    Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  const remainingAmount = goal.amount - savedSoFar;
  const perDay = Math.ceil(remainingAmount / remainingDays);

  return (
    <div className="agent-card">
      <h3>🧭 Savings Coach</h3>
      <p>
        You need to save <b>₹{perDay}</b> per day for the next {remainingDays} days
        to reach your goal.
      </p>
    </div>
  );
}
