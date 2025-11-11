import Panel from "./Panel"; // works if same folder
import { useAIAdvisor } from "../hooks/useAIAdvisor";
import '../hooks/AIAdvisor.css';

export default function AIAdvisorPanel() {
  const aiTips = useAIAdvisor();

  if (!aiTips || aiTips.length === 0) return null;

  return (
    <Panel title="Smart Savings Tips">
      <ul className="ai-tips-list">
        {aiTips.map((tip, idx) => (
          <li key={idx} className="ai-tip">{tip}</li>
        ))}
      </ul>
    </Panel>
  );
}
