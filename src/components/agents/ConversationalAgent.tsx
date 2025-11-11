// components/agents/ConversationalAgent.tsx
import { useState } from "react";
import { useSavings } from "../../context/SavingsProvider";

function categorize(expenseTitle: string) {
  const t = expenseTitle.toLowerCase();
  if (/food|dine|restaurant|cafe/.test(t)) return "Food";
  if (/rent|house|apartment/.test(t)) return "Rent";
  if (/shop|mall|amazon|flipkart/.test(t)) return "Shopping";
  if (/subscript|netflix|spotify/.test(t)) return "Subscriptions";
  return "Other";
}

export default function ConversationalAgent() {
  const { expenses, goal } = useSavings();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = () => {
    const q = query.toLowerCase();

    if (q.includes("food")) {
      const spent = expenses
        .filter((e) => categorize(e.title) === "Food")
        .reduce((s, e) => s + e.amount, 0);
      setAnswer(`You spent ₹${spent} on food so far.`);
    } else if (q.includes("afford")) {
      const priceMatch = q.match(/\d+/);
      if (!priceMatch) {
        setAnswer("Please mention a price, e.g., ‘Can I afford a phone for 20000?’");
        return;
      }
      const price = Number(priceMatch[0]);
      const spent = expenses.reduce((s, e) => s + e.amount, 0);
      const balance = goal ? goal.amount - spent : 0;
      setAnswer(
        price <= balance
          ? "✅ Yes, you can afford this purchase."
          : "⚠️ No, buying this may stop you from reaching your goal."
      );
    } else {
      setAnswer("I can answer questions about spending and affordability right now.");
    }
  };

  return (
    <div className="agent-card">
      <h3>🤖 Finance Assistant</h3>
      <input
        type="text"
        placeholder="Ask me something..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleAsk}>Ask</button>
      {answer && <p className="mt-2">{answer}</p>}
    </div>
  );
}
