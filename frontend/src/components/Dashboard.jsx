import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoadmapCard from './RoadmapCard';
import { roadmapApi } from '../api/roadmaps';

export default function Dashboard({ roadmaps, setRoadmaps }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState(null);
  const [progress, setProgress] = useState({});
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await roadmapApi.get(id);
        setRoadmapData(data);
        setRoadmaps(prev =>
          prev.map(r =>
            r.id === id ? { ...r, roadmap: data.roadmap } : r
          )
        );
      } catch (error) {
        console.error('Failed to load roadmap:', error);
      }
    };
    loadData();
  }, [id, setRoadmaps]);

  const logProgress = async (stageIndex, completionRate) => {
    try {
      const log = { 
        stage: stageIndex, 
        completion_rate: completionRate, 
        date: new Date().toISOString().split('T')[0] 
      };
      
      const updated = await roadmapApi.update(id, log);
      setRoadmapData(updated);
      setProgress(prev => ({
        ...prev,
        [stageIndex]: completionRate
      }));
    } catch (error) {
      console.error('Progress update failed:', error);
      alert('Failed to update progress');
    }
  };

  const handleRegenerate = async () => {
    try {
      const log = { stage: -1, completion_rate: 0.3, date: new Date().toISOString().split('T')[0] };
      const updated = await roadmapApi.update(id, log);
      setRoadmapData(updated);
      setCurrentStageIndex(0);
    } catch (error) {
      console.error('Regeneration failed:', error);
    }
  };

  // Navigation handlers
  const goToNext = () => {
    if (currentStageIndex < (roadmapData?.roadmap?.length || 0) - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  const goToStage = (index) => {
    setCurrentStageIndex(index);
  };

  if (!roadmapData) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-4" style={{ width: '4rem', height: '4rem' }} role="status">
            <span className="visually-hidden">Loading roadmap...</span>
          </div>
          <h4 className="text-muted">Loading your personalized roadmap</h4>
          <p className="text-muted">Please wait while we fetch your roadmap...</p>
        </div>
      </div>
    );
  }

  const totalStages = roadmapData.roadmap.length;
  const currentStage = roadmapData.roadmap[currentStageIndex];

  // ✅ NEW: Calculate total completion percentage
  const totalProgress = roadmapData.roadmap.reduce((acc, stage, index) => {
    return acc + (progress[index] || 0);
  }, 0) / totalStages;

  return (
    <div className="container py-5 min-vh-100 bg-light">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-xxl-9 col-12 mx-auto">
          
          {/* Header Section with TOTAL PROGRESS */}
          <div className="card border-0 shadow-lg rounded-4 mb-5 overflow-hidden">
      <div className="card-body text-success  p-5 text-center bg-gradient" 
           style={{
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
             color: 'white'
           }}>
        <h1 className="display-5 fw-bold mb-3 lh-sm">Your Personalized Roadmap</h1>
        
        {/* TOTAL PROGRESS BAR */}
        <div className="mb-4">
          <div className="progress mx-auto mb-3" style={{ width: '250px', height: '12px' }}>
            <div 
              className="progress-bar bg-success shadow-sm" 
              role="progressbar"
              style={{ width: `${totalProgress * 100}%` }}
            >
              <small className="fw-bold ms-2">{Math.round(totalProgress * 100)}%</small>
            </div>
          </div>
          <h4 className="fw-bold mb-0 text-success-50">
            {Math.round(totalProgress * 100)}% Complete • {totalStages} Stages
          </h4>
        </div>
        
        <div className="row g-4 justify-content-center mb-4">
          <div className="col-md-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3 p-3">
              <small className="text-success-50 mb-1 d-block">Education Level</small>
              <h5 className="fw-semibold mb-0">{roadmapData?.userData?.year || 'Not specified'}</h5>
            </div>
          </div>
          <div className="col-md-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3 p-3">
              <small className="text-success-50 mb-1 d-block">Target Skills</small>
              <h5 className="fw-semibold mb-0">
                {roadmapData?.userData?.skills?.slice(0, 3).join(', ') || 'Not specified'}
                {roadmapData?.userData?.skills?.length > 3 && '...'}
              </h5>
            </div>
          </div>
        </div>

        {roadmapData?.progressLogs?.length > 0 && (
          <div className="alert alert-success alert-dismissible fade show bg-success bg-opacity-20 border-0" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            Progress tracked: <strong>{roadmapData.progressLogs.length}</strong> updates logged
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="alert"></button>
          </div>
        )}
      </div>
    </div>

          {/* SINGLE Roadmap Card */}
          <div className="row g-4 mb-5">
            <div className="col-12">
              <RoadmapCard 
                stage={currentStage} 
                index={currentStageIndex}
                onProgress={logProgress}
                progress={progress[currentStageIndex] || 0}
              />
            </div>
          </div>

          {/* Stage Navigation */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-10 col-lg-8">
              {/* Progress Dots */}
              <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                {roadmapData.roadmap.map((_, index) => {
                  const isActive = index === currentStageIndex;
                  const isCompleted = progress[index] > 0;
                  return (
                    <button
                      key={index}
                      onClick={() => goToStage(index)}
                      className={`rounded-circle transition-all border-0 p-2 ${
                        isCompleted ? 'bg-success text-white shadow-sm' :
                        isActive ? 'bg-primary text-white shadow' :
                        'bg-light shadow-sm'
                      }`}
                      style={{ width: '45px', height: '45px' }}
                    >
                      {isCompleted ? <i className="bi bi-check-lg"></i> : index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button
                  onClick={goToPrevious}
                  disabled={currentStageIndex === 0}
                  className="btn btn-outline-primary px-5 py-3 rounded-pill shadow-sm flex-grow-1 flex-sm-grow-0"
                  style={{ minWidth: '140px' }}
                >
                  <i className="bi bi-arrow-left me-2"></i>Previous
                </button>
                
                <button
                  onClick={goToNext}
                  disabled={currentStageIndex === totalStages - 1}
                  className="btn btn-primary px-5 py-3 rounded-pill shadow-lg flex-grow-1 flex-sm-grow-0"
                  style={{ minWidth: '140px' }}
                >
                  Next <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>

              {/* Stage Progress */}
              <div className="text-center mt-4">
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar"
                    style={{ width: `${((currentStageIndex + 1) / totalStages) * 100}%` }}
                  />
                </div>
                <small className="text-muted">
                  Stage {currentStageIndex + 1} of {totalStages}
                </small>
              </div>
            </div>
          </div>

          {/* Regenerate Button */}
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <button 
                  onClick={handleRegenerate}
                  className="btn btn-warning btn-lg px-5 py-3 rounded-pill shadow-lg w-100"
                  style={{ borderRadius: '50px', fontSize: '1.1rem', fontWeight: '600' }}
                >
                  <i className="bi bi-arrow-clockwise me-3"></i>
                  <span className="d-none d-md-inline">I'm off-track - </span>
                  Regenerate My Roadmap
                </button>
                <small className="text-muted mt-2 d-block">
                  Generate a new roadmap based on your current progress
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}