import { useState } from "react";
import { useSavings } from "../context/SavingsProvider";
import SavingsGoalForm from "../components/SavingsGoalForm";
import ActivePlanDashboard from "../components/ActivePlanDashboard";
import { useAIAdvisor } from "../hooks/useAIAdvisor";
import ConversationalAgent from "../components/agents/ConversationalAgent";
import Panel from "../components/Panel";
import "./Dashboard.css";

export default function Dashboard() {
  const { goal } = useSavings();
  const aiTips = useAIAdvisor();
  const [showAI, setShowAI] = useState(true);

  if (!goal) return <SavingsGoalForm />;

  return (
    <div className="dashboard-container">
      {/* Active Plan Dashboard */}
      <ActivePlanDashboard />

      {/* AI Insights Panel */}
      <Panel title="🤖 Smart Finance Assistant">
        <button
          className="toggle-btn"
          onClick={() => setShowAI(!showAI)}
        >
          {showAI ? "Hide Insights" : "Show Insights"}
        </button>

        {showAI && (
          <ul className="ai-tips-list">
            {aiTips.length === 0 ? (
              <li>No insights yet. Add some expenses to get started!</li>
            ) : (
              aiTips.map((tip, idx) => (
                <li key={idx} className="ai-tip">
                  {tip}
                </li>
              ))
            )}
          </ul>
        )}
      </Panel>

      {/* Conversational AI Agent */}
      <Panel>
        <ConversationalAgent />
      </Panel>
    </div>
  );
}
