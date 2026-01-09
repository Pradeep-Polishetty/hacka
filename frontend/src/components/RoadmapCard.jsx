import { useState } from 'react';

export default function RoadmapCard({ stage, index, onProgress }) {
  const [completed, setCompleted] = useState(false);


  return (
    <div className="text-primary roadmap-card">
      <h3>{stage.title}</h3>
      <ul>
        {stage.tasks.map((task, i) => (
          <li key={i}>{task}</li>
        ))}
      </ul>
      <p><strong>Daily Goal:</strong> {stage.daily_goal}</p>
      <p><em>{stage.why_important}</em></p>
      <div className="progress-actions">
        <button onClick={() => { setCompleted(true); onProgress(index, 1.0); }}>Completed</button>
        <button onClick={() => onProgress(index, 0.5)}>50% Done</button>
        <button onClick={() => onProgress(index, 0.0)}>Not Started</button>
      </div>
      {completed && <span>✅ Logged!</span>}
    </div>
  );
}
