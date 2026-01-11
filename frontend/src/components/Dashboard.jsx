import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoadmapCard from './RoadmapCard';
import { roadmapApi } from '../api/roadmaps';
import './Dashboard.css';

export default function Dashboard({ roadmaps, setRoadmaps }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState(null);
  const [progress, setProgress] = useState({});
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

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
    const log = { 
      stage: stageIndex, 
      completion_rate: completionRate, 
      date: new Date().toISOString().split('T')[0] 
    };
    const updated = await roadmapApi.update(id, log);
    setRoadmapData(updated);
    
    // Update progress state for visual feedback
    setProgress(prev => ({
      ...prev,
      [stageIndex]: completionRate
    }));
  };

  const handleRegenerate = async () => {
    await logProgress(-1, 0.3);
    setShowRegenerateModal(false);
    // You can add navigation or refresh logic here
  };

  const calculateOverallProgress = () => {
    if (!roadmapData?.roadmap) return 0;
    const total = Object.values(progress).reduce((sum, val) => sum + val, 0);
    return Math.round((total / roadmapData.roadmap.length) * 100);
  };

  if (!roadmapData) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();
  const completedStages = Object.values(progress).filter(p => p === 1.0).length;

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-link text-white p-0 mb-2"
              >
                <i className="fas fa-arrow-left me-2"></i>Back to Home
              </button>
              <h1 className="text-white mb-2">Your Career Roadmap</h1>
              <p className="text-white-50 mb-0">
                <i className="fas fa-user me-2"></i>
                {roadmapData.year} • {roadmapData.skills?.join(', ')}
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button 
                onClick={() => setShowRegenerateModal(true)}
                className="btn btn-outline-light"
              >
                <i className="fas fa-sync-alt me-2"></i>Regenerate Roadmap
              </button>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="progress-summary mt-4">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon bg-primary">
                    <i className="fas fa-tasks"></i>
                  </div>
                  <div>
                    <h3 className="mb-0">{roadmapData.roadmap?.length || 0}</h3>
                    <p className="mb-0 text-muted">Total Stages</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon bg-success">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div>
                    <h3 className="mb-0">{completedStages}</h3>
                    <p className="mb-0 text-muted">Completed</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon bg-warning">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div>
                    <h3 className="mb-0">{overallProgress}%</h3>
                    <p className="mb-0 text-muted">Overall Progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="progress" style={{height: '10px', borderRadius: '10px'}}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{width: `${overallProgress}%`}}
                  aria-valuenow={overallProgress} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Cards */}
      <div className="container py-5">
        <div className="roadmap-timeline">
          {roadmapData.roadmap.map((stage, index) => (
            <RoadmapCard 
              key={index} 
              stage={stage} 
              index={index} 
              onProgress={logProgress}
              currentProgress={progress[index] || 0}
            />
          ))}
        </div>
      </div>

      {/* Regenerate Modal */}
      {showRegenerateModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Regenerate Roadmap?</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowRegenerateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center py-3">
                  <i className="fas fa-exclamation-circle text-warning" style={{fontSize: '3rem'}}></i>
                  <p className="mt-3 mb-0">
                    Are you feeling off-track? We'll regenerate your roadmap based on your current progress and adjust it to help you get back on course.
                  </p>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowRegenerateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleRegenerate}
                >
                  <i className="fas fa-sync-alt me-2"></i>Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}