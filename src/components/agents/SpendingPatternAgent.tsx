// components/agents/SpendingPatternAgent.tsx
import { useSavings } from "../../context/SavingsProvider";

function categorize(expenseTitle: string) {
  const t = expenseTitle.toLowerCase();
  if (/food|dine|restaurant|cafe/.test(t)) return "Food";
  if (/rent|house|apartment/.test(t)) return "Rent";
  if (/shop|mall|amazon|flipkart/.test(t)) return "Shopping";
  if (/subscript|netflix|spotify/.test(t)) return "Subscriptions";
  return "Other";
}

export default function SpendingPatternAgent() {
  const { expenses } = useSavings();

  if (!expenses.length) return null;

  const totals: Record<string, number> = {};
  expenses.forEach((e) => {
    const cat = categorize(e.title);
    totals[cat] = (totals[cat] || 0) + e.amount;
  });

  const topOverspend = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="agent-card">
      <h3>💡 Spending Pattern Agent</h3>
      {topOverspend ? (
        <p>
          You’re spending the most on <b>{topOverspend[0]}</b>: ₹{topOverspend[1]}.
        </p>
      ) : (
        <p>No spending detected yet.</p>
      )}
    </div>
  );
}
