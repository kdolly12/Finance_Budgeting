import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSavings } from "../context/SavingsProvider";
import SavingsGoalForm from "../components/SavingsGoalForm";

export default function SavingsGoalSetupPage() {
  const { goal } = useSavings();
  const navigate = useNavigate();

  // If the user already has a goal, skip setup and go to dashboard
  useEffect(() => {
    if (goal) navigate("/dashboard");
  }, [goal, navigate]);

  return (
    <div className="goal-setup-container" style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🎯 Let’s set your first savings goal!</h1>
      <p>Enter your goal amount and duration to get started.</p>
      <SavingsGoalForm />
    </div>
  );
}
