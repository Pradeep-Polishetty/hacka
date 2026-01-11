import { useState } from 'react';

export default function RoadmapCard({ stage, index, onProgress, currentProgress }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleProgressUpdate = (rate) => {
    onProgress(index, rate);
    if (rate === 1.0) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const getProgressBadge = () => {
    if (currentProgress === 1.0) return { text: 'Completed', class: 'bg-success' };
    if (currentProgress === 0.5) return { text: '50% Done', class: 'bg-warning' };
    if (currentProgress > 0) return { text: 'In Progress', class: 'bg-info' };
    return { text: 'Not Started', class: 'bg-secondary' };
  };

  const progressBadge = getProgressBadge();

  return (
    <div className="roadmap-card-wrapper">
      {/* Timeline Dot */}
      <div className="timeline-dot-container">
        <div className={`timeline-dot ${currentProgress === 1.0 ? 'completed' : ''}`}>
          {currentProgress === 1.0 ? (
            <i className="fas fa-check text-white"></i>
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
        <div className="timeline-line"></div>
      </div>

      {/* Card Content */}
      <div className="roadmap-card">
        {/* Clickable Header to Expand/Collapse */}
        <div 
          className="card-header-custom" 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <span className="stage-number">Stage {index + 1}</span>
                <span className={`badge ${progressBadge.class} ms-2`}>
                  {progressBadge.text}
                </span>
              </div>
              <h3 className="card-title mb-2">{stage.title}</h3>
              <p className="card-subtitle text-muted mb-0">
                <i className="fas fa-clock me-2"></i>{stage.daily_goal}
              </p>
            </div>
            <button 
              className="btn btn-link text-muted p-0" 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        {/* Expandable Content */}
        <div className={`card-body-custom ${isExpanded ? 'expanded' : ''}`}>
          {/* Why Important */}
          <div className="importance-box mb-4">
            <div className="d-flex align-items-start">
              <i className="fas fa-lightbulb text-warning me-2 mt-1"></i>
              <div>
                <strong className="d-block mb-1">Why This Matters:</strong>
                <p className="mb-0 text-muted">{stage.why_important}</p>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="tasks-section mb-4">
            <h6 className="fw-bold mb-3">
              <i className="fas fa-list-check me-2"></i>Tasks to Complete:
            </h6>
            <ul className="task-list">
              {stage.tasks.map((task, i) => (
                <li key={i} className="task-item">
                  <i className="fas fa-circle text-primary me-2" style={{fontSize: '6px'}}></i>
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          {stage.resources && stage.resources.length > 0 && (
            <div className="resources-section mb-4">
              <h6 className="fw-bold mb-3">
                <i className="fas fa-book-open me-2"></i>Recommended Resources:
              </h6>
              <div className="resources-list">
                {stage.resources.map((resource, i) => (
                  <a 
                    key={i} 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-item"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="d-flex align-items-start">
                      <div className="resource-icon">
                        <i className={`fas ${
                          resource.type === 'video' ? 'fa-video' :
                          resource.type === 'article' ? 'fa-newspaper' :
                          resource.type === 'course' ? 'fa-graduation-cap' :
                          resource.type === 'documentation' ? 'fa-file-code' :
                          resource.type === 'practice' ? 'fa-code' :
                          'fa-link'
                        }`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="resource-title mb-1">{resource.title}</p>
                        {resource.description && (
                          <p className="resource-description mb-0">{resource.description}</p>
                        )}
                        <span className="resource-badge">
                          {resource.type || 'Resource'}
                        </span>
                      </div>
                      <i className="fas fa-external-link-alt text-muted ms-2"></i>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Progress Actions */}
          <div className="progress-actions">
            <p className="small text-muted mb-2">Update your progress:</p>
            <div className="btn-group w-100" role="group">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleProgressUpdate(1.0);
                }}
                className="btn btn-outline-success"
                disabled={currentProgress === 1.0}
              >
                <i className="fas fa-check-circle me-1"></i>
                Completed
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleProgressUpdate(0.5);
                }}
                className="btn btn-outline-warning"
              >
                <i className="fas fa-clock me-1"></i>
                50% Done
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleProgressUpdate(0.0);
                }}
                className="btn btn-outline-secondary"
              >
                <i className="fas fa-circle me-1"></i>
                Not Started
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="alert alert-success mt-3 mb-0 d-flex align-items-center">
              <i className="fas fa-check-circle me-2"></i>
              <span>Great job! Progress logged successfully! 🎉</span>
            </div>
          )}
        </div>

        {/* Quick View (when collapsed) */}
        {!isExpanded && (
          <div 
            className="card-footer-custom"
            onClick={() => setIsExpanded(true)}
            style={{ cursor: 'pointer' }}
          >
            <small className="text-muted">
              <i className="fas fa-tasks me-1"></i>
              {stage.tasks.length} tasks
              {stage.resources && stage.resources.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <i className="fas fa-book-open me-1"></i>
                  {stage.resources.length} resources
                </>
              )}
              <span className="mx-2">•</span>
              Click to expand
            </small>
          </div>
        )}
      </div>
    </div>
  );
}