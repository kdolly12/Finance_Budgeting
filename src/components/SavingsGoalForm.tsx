import { useState } from "react";
import { useSavings } from "../context/SavingsProvider";

export default function SavingsGoalForm() {
  const { saveGoal } = useSavings();
  const [amount, setAmount] = useState<number | "">("");
  const [duration, setDuration] = useState<number | "">("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!amount || amount <= 0) {
      setError("Please enter a valid goal amount.");
      return;
    }
    if (!duration || duration <= 0) {
      setError("Please enter a valid duration in months.");
      return;
    }

    setError(""); // Clear previous errors

    // Save goal
    try {
      await saveGoal({ amount: Number(amount), durationMonths: Number(duration) });
      setAmount("");
      setDuration("");
      alert("🎯 Savings goal saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save goal. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
        <h2>Create Your Savings Goal</h2>
        <form onSubmit={handleSubmit} className="flex-column" style={{ gap: "1rem" }}>
          <input
            type="number"
            placeholder="Goal Amount ($)"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={0}
          />
          <input
            type="number"
            placeholder="Duration (months)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={1}
          />
          <button type="submit">Save Goal</button>
          {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
