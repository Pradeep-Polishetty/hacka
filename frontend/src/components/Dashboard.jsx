import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RoadmapCard from './RoadmapCard';
import { roadmapApi } from '../api/roadmaps';

export default function Dashboard({ roadmaps, setRoadmaps }) {
  const { id } = useParams();
  const [roadmapData, setRoadmapData] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const data = await roadmapApi.get(id);
      setRoadmapData(data);
      setRoadmaps(prev =>
  prev.map(r =>
    r.id === id ? { ...r, roadmap: data.roadmap } : r
  )
);

    };
    loadData();
  }, [id]);

  const logProgress = async (stageIndex, completionRate) => {
    const log = { stage: stageIndex, completion_rate: completionRate, date: new Date().toISOString().split('T')[0] };
    const updated = await roadmapApi.update(id, log);
    setRoadmapData(updated);
  };

  if (!roadmapData) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Your Roadmap</h1>
      <div className="roadmap-grid">
        {roadmapData.roadmap.map((stage, index) => (
          <RoadmapCard key={index} stage={stage} index={index} onProgress={logProgress} />
        ))}
      </div>
      <button onClick={() => logProgress(-1, 0.3)} className="regenerate">I'm off-track - Regenerate</button>
    </div>
  );
}
