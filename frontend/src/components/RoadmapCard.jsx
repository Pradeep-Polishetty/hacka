import { useState, useEffect } from 'react';

export default function RoadmapCard({ stage, index, onProgress, progress = 0 }) {
  // FIXED: Use progress prop to control local state instead of independent completed state
  const [showSuccess, setShowSuccess] = useState(false);
  const isCompleted = progress === 1.0;

  // Show success message briefly when progress changes to 1.0
  useEffect(() => {
    if (progress === 1.0) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div 
      className="card border-0 shadow-lg h-100 transition-all rounded-4"
      style={{ 
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
        border: 'progress === 1.0 ? "1px solid rgba(40,167,69,0.3)" : "1px solid rgba(0,123,255,0.1)"'
      }}
    >
      {/* Card Header with Progress Bar */}
      <div className="card-header bg-primary bg-gradient text-white p-4 rounded-top-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h3 className="h5 fw-bold mb-1 lh-sm">{stage.title}</h3>
            <small className="opacity-90">{`Week ${Math.floor(index / 3) + 1}, Day ${index + 1}`}</small>
          </div>
          <div className="progress mb-0" style={{ height: '6px', width: '80px' }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        
        {/* Daily Goal Badge */}
        <div className="bg-white bg-opacity-20 rounded-pill px-3 py-1 d-inline-block">
          <i className="bi bi-lightning-charge-fill me-1"></i>
          <small className="fw-semibold">{stage.daily_goal}</small>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-4 pb-2">
        {/* Tasks List */}
        <div className="mb-4">
          <small className="text-uppercase fw-bold text-primary mb-2 d-block">Tasks</small>
          <div className="mt-2">
            {stage.tasks.map((task, i) => (
              <div key={i} className="d-flex align-items-start gap-2 p-2 bg-light rounded-3 mb-2">
                <div className="rounded-circle bg-primary bg-opacity-20 p-1 mt-1 flex-shrink-0 d-flex align-items-center justify-content-center" 
                     style={{width: '12px', height: '12px'}}>
                  <i className="bi bi-circle-fill text-primary" style={{fontSize: '8px'}}></i>
                </div>
                <span className="small lh-sm flex-grow-1">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Important */}
        {stage.why_important && (
          <div className="mb-4 p-3 bg-warning bg-opacity-10 border-start border-4 border-warning rounded-3">
            <small className="text-warning fw-bold mb-1 d-block">
              <i className="bi bi-lightbulb me-1"></i>Why This Matters
            </small>
            <p className="mb-0 small text-muted lh-sm">{stage.why_important}</p>
          </div>
        )}

        {/* Resources */}
        {stage.resources && stage.resources.length > 0 && (
          <div className="mb-4">
            <small className="text-uppercase fw-bold text-success mb-2 d-block">
              Resources <span className="badge bg-success bg-opacity-20">{stage.resources.length}</span>
            </small>
            <div className="d-flex flex-column gap-2">
              {stage.resources.map((resource, i) => (
                <a 
                  key={i} 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-success btn-sm px-3 py-2 rounded-pill w-100 text-start shadow-sm"
                >
                  <i className="bi bi-box-arrow-up-right me-2"></i>
                  <span className="small fw-medium">{resource.platform}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="card-footer bg-white border-0 pt-0 pb-3 px-4">
        <div className="d-flex gap-2 flex-wrap">
          <button 
            onClick={() => onProgress(index, 1.0)} 
            className={`px-3 py-2 rounded-pill flex-fill shadow-sm transition-all ${
              isCompleted ? 'btn-success' : 'btn-outline-success border-2'
            }`}
            disabled={isCompleted}
          >
            <i className={`bi ${isCompleted ? 'bi-check-lg' : 'bi-check-circle'} me-1`}></i>
            {isCompleted ? 'Completed ✓' : 'Mark Complete'}
          </button>
          
          <button 
            onClick={() => onProgress(index, 0.5)}
            className={`px-3 py-2 rounded-pill flex-fill shadow-sm transition-all ${
              progress === 0.5 ? 'btn-warning' : 'btn-outline-warning border-2'
            }`}
            disabled={isCompleted}
          >
            <i className={`bi ${progress === 0.5 ? 'bi-half-circle-fill' : 'bi-circle-half'} me-1`}></i>
            {progress === 0.5 ? '50% ✓' : '50% Done'}
          </button>
          
          <button 
            onClick={() => onProgress(index, 0.0)}
            className="btn btn-outline-secondary px-3 py-2 rounded-pill flex-fill shadow-sm"
            disabled={isCompleted}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            Reset
          </button>
        </div>
        
        {showSuccess && (
          <div className="mt-3 p-2 bg-success-subtle border border-success-subtle rounded-3 text-center">
            <i className="bi bi-check-circle-fill text-success me-1"></i>
            <small className="fw-semibold text-success">Progress updated successfully!</small>
          </div>
        )}
      </div>
    </div>
  );
}