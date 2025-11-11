import { useSavings } from "../context/SavingsProvider";
import ExpenseForm from "./ExpenseForm";
import './ActivePlanDashboard.css';

export default function ActivePlanDashboard() {
  const { goal, expenses, removeExpense } = useSavings();

  if (!goal) return null; // no goal, nothing to display

  const monthlyLimit = goal.amount / goal.durationMonths;

  const monthlySpent = expenses
    .filter((e) => e.type === "monthly")
    .reduce((sum, e) => sum + e.amount, 0);

  const progressPercent = Math.min(100, (monthlySpent / monthlyLimit) * 100);

  return (
    <div className="dashboard-container">
      {/* ----- Goal Summary Card ----- */}
      <div className="dashboard-card">
        <h2>Your Savings Plan</h2>
        <p>🎯 Goal Amount: ₹{goal.amount.toFixed(2)}</p>
        <p>⏳ Duration: {goal.durationMonths} months</p>
        <p>💰 Monthly Limit: ₹{monthlyLimit.toFixed(2)}</p>

        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${progressPercent}%`,
              background: "#FF6B6B", // pastel coral
            }}
          >
            {Math.round(progressPercent)}%
          </div>
        </div>
      </div>

      {/* ----- Expense Form Card ----- */}
      <div className="dashboard-card">
        <ExpenseForm />
      </div>

      {/* ----- Expenses List Card ----- */}
      <div className="dashboard-card">
        <h3>Expenses</h3>
        {expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <ul className="expenses-list">
            {expenses.map((e) => (
              <li key={e.id} className="expense-item">
                <div className="expense-info">
                  <span>
                    {e.title} - ₹{e.amount.toFixed(2)} ({e.type})
                  </span>
                  {e.photoUrl && (
                    <img
                      src={e.photoUrl}
                      alt="Receipt"
                      className="receipt"
                    />
                  )}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => removeExpense(e.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
