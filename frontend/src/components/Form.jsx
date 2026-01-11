import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Form({ onGenerate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    education: '',
    skills: [],
    customSkills: [],
    companies: [],
    customCompanies: [],
    interests: [],
    customInterests: [],
    weeks: '4'
  });
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Education', icon: 'bi-mortarboard-fill' },
    { number: 2, title: 'Skills', icon: 'bi-code-slash' },
    { number: 3, title: 'Companies', icon: 'bi-building' },
    { number: 4, title: 'Interests', icon: 'bi-heart-fill' },
    { number: 5, title: 'Duration', icon: 'bi-clock-fill' }
  ];

  const educationOptions = [
    '1st Year BTech', '2nd Year BTech', '3rd Year BTech', '4th Year BTech',
    'Final Year MCA', 'Recent Graduate'
  ];

  const skillOptions = [
    'JavaScript', 'React', 'Python', 'Java', 'Node.js', 
    'SQL', 'Git', 'HTML/CSS', 'TypeScript', 'MongoDB', 'C++', 'AWS'
  ];

  const companyOptions = [
    'Infosys', 'TCS', 'Wipro', 'Accenture', 'Cognizant',
    'HCL', 'Tech Mahindra', 'Capgemini', 'IBM', 'Microsoft', 'Google', 'Amazon'
  ];

  const interestOptions = [
    'Web Development', 'Mobile Apps', 'Data Science', 'Machine Learning',
    'Cloud Computing', 'DevOps', 'Cybersecurity', 'Backend Development'
  ];

  const weeksOptions = [
    { value: '2', label: '2 Weeks' },
    { value: '4', label: '4 Weeks' },
    { value: '6', label: '6 Weeks' },
    { value: '8', label: '8 Weeks' }
  ];

  const handleEducationSelect = (option) => {
    setFormData({ ...formData, education: option });
  };

  const toggleSelection = (category, item) => {
    const current = formData[category];
    if (current.includes(item)) {
      setFormData({ ...formData, [category]: current.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [category]: [...current, item] });
    }
  };

  const addCustomItem = (category) => {
    if (customInput.trim()) {
      const customCategory = `custom${category.charAt(0).toUpperCase() + category.slice(1)}`;
      setFormData({
        ...formData,
        [customCategory]: [...formData[customCategory], customInput.trim()]
      });
      setCustomInput('');
    }
  };

  const handleWeeksChange = (value) => {
    setFormData({ ...formData, weeks: value });
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.education) {
      alert('Please select your education level');
      return;
    }
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Prepare data in the format your API expects
      const userData = {
        year: formData.education,
        skills: [...formData.skills, ...formData.customSkills],
        companies: [...formData.companies, ...formData.customCompanies],
        interests: [...formData.interests, ...formData.customInterests],
        weeks: parseInt(formData.weeks) || 4
      };
      
      const id = await onGenerate(userData);
      navigate(`/dashboard/${id}`);
    } catch (error) {
      alert('Error generating roadmap');
      console.error(error);
    }
    setLoading(false);
  };

  const allSelected = (category) => {
    const customCategory = `custom${category.charAt(0).toUpperCase() + category.slice(1)}`;
    return [...formData[category], ...formData[customCategory]];
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          {/* Stepper */}
          <div className="d-flex align-items-center justify-content-center mb-5 pb-4 position-relative">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isFuture = currentStep < step.number;
              
              return (
                <div key={step.number} className="d-flex align-items-center flex-column position-relative">
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center mb-2 transition-all ${
                      isCompleted ? 'bg-success text-white shadow' : 
                      isActive ? 'bg-primary text-white shadow' : 
                      'bg-light border border-secondary-subtle'
                    }`}
                    style={{ width: '50px', height: '50px', fontSize: '1.1rem' }}
                  >
                    {isCompleted ? (
                      <i className={`bi ${step.icon}`} />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={`position-absolute top-50 end-0 translate-middle-y ${
                        isCompleted || isActive ? 'bg-primary' : 'bg-light border-end border-secondary-subtle'
                      }`}
                      style={{ width: '60px', height: '2px', zIndex: -1 }}
                    />
                  )}
                  <small className="text-muted mt-1 fw-medium">{step.title}</small>
                </div>
              );
            })}
          </div>

          {/* Step Progress Text */}
          <div className="text-center mb-5">
            <h6 className="text-muted">Step {currentStep} of 5</h6>
            <h2 className="fw-bold text-dark mb-1">{steps[currentStep - 1].title}</h2>
          </div>

          {/* Form Card */}
          <div className="card shadow-lg border-0 rounded-4 p-5">
            
            {/* Step 1: Education */}
            {currentStep === 1 && (
              <div>
                <p className="text-center text-muted mb-5 fs-6">This helps us tailor the roadmap to your timeline</p>
                <div className="row g-4">
                  {educationOptions.map((option) => (
                    <div key={option} className="col-md-6 col-lg-4">
                      <button
                        type="button"
                        onClick={() => handleEducationSelect(option)}
                        className={`btn w-100 py-3 rounded-3 border-2 transition-all ${
                          formData.education === option 
                            ? 'btn-primary shadow-lg' 
                            : 'btn-outline-primary hover-shadow'
                        }`}
                      >
                        {option}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Skills */}
            {currentStep === 2 && (
              <div>
                <p className="text-center text-muted mb-5 fs-6">Select all that apply or add your own</p>
                <div className="mb-5">
                  <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSelection('skills', skill)}
                        className={`btn btn-outline-primary px-3 py-2 rounded-pill fw-medium transition-all ${
                          formData.skills.includes(skill) ? 'btn-primary text-white shadow-sm' : ''
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Input */}
                  <div className="input-group">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomItem('skills');
                        }
                      }}
                      placeholder="Add custom skill (press Enter)"
                      className="form-control form-control-lg rounded-end-0 border-end-0"
                    />
                    <button
                      type="button"
                      onClick={() => addCustomItem('skills')}
                      className="btn btn-outline-primary px-4 rounded-start-0"
                    >
                      Add
                    </button>
                  </div>

                  {/* Selected Items */}
                  {allSelected('skills').length > 0 && (
                    <div className="mt-4 p-3 bg-light rounded-3">
                      <small className="text-muted mb-2 d-block">Selected skills:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {allSelected('skills').map((skill, idx) => (
                          <span key={idx} className="badge bg-primary">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Companies */}
            {currentStep === 3 && (
              <div>
                <p className="text-center text-muted mb-5 fs-6">We'll focus on skills these companies look for</p>
                <div className="mb-5">
                  <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                    {companyOptions.map((company) => (
                      <button
                        key={company}
                        type="button"
                        onClick={() => toggleSelection('companies', company)}
                        className={`btn btn-outline-primary px-3 py-2 rounded-pill fw-medium transition-all ${
                          formData.companies.includes(company) ? 'btn-primary text-white shadow-sm' : ''
                        }`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Input */}
                  <div className="input-group">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomItem('companies');
                        }
                      }}
                      placeholder="Add custom company (press Enter)"
                      className="form-control form-control-lg rounded-end-0 border-end-0"
                    />
                    <button
                      type="button"
                      onClick={() => addCustomItem('companies')}
                      className="btn btn-outline-primary px-4 rounded-start-0"
                    >
                      Add
                    </button>
                  </div>

                  {/* Selected Items */}
                  {allSelected('companies').length > 0 && (
                    <div className="mt-4 p-3 bg-light rounded-3">
                      <small className="text-muted mb-2 d-block">Target companies:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {allSelected('companies').map((company, idx) => (
                          <span key={idx} className="badge bg-primary">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Interests */}
            {currentStep === 4 && (
              <div>
                <p className="text-center text-muted mb-5 fs-6">Help us personalize your learning path</p>
                <div className="mb-5">
                  <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleSelection('interests', interest)}
                        className={`btn btn-outline-primary px-3 py-2 rounded-pill fw-medium transition-all ${
                          formData.interests.includes(interest) ? 'btn-primary text-white shadow-sm' : ''
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Input */}
                  <div className="input-group">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomItem('interests');
                        }
                      }}
                      placeholder="Add custom interest (press Enter)"
                      className="form-control form-control-lg rounded-end-0 border-end-0"
                    />
                    <button
                      type="button"
                      onClick={() => addCustomItem('interests')}
                      className="btn btn-outline-primary px-4 rounded-start-0"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Weeks Duration */}
            {currentStep === 5 && (
              <div>
                <p className="text-center text-muted mb-5 fs-6">Choose the duration that fits your timeline</p>
                <div className="row g-4">
                  {weeksOptions.map((option) => (
                    <div key={option.value} className="col-md-6">
                      <button
                        type="button"
                        onClick={() => handleWeeksChange(option.value)}
                        className={`btn w-100 py-4 rounded-3 border-2 h-100 transition-all ${
                          formData.weeks === option.value 
                            ? 'btn-primary shadow-lg text-white' 
                            : 'btn-outline-primary hover-shadow'
                        }`}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <i className="bi bi-calendar3 display-6 mb-2"></i>
                          <span className="fs-5 fw-bold">{option.label}</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Selected: <strong className="text-primary">{weeksOptions.find(w => w.value === formData.weeks)?.label}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between gap-3 mt-5 pt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn btn-outline-secondary px-5 py-3 rounded-pill flex-grow-1 transition-all"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary px-5 py-3 rounded-pill flex-grow-1 shadow transition-all"
                >
                  Next <i className="bi bi-arrow-right ms-2"></i>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn btn-success px-5 py-3 rounded-pill flex-grow-1 shadow transition-all"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Roadmap <i className="bi bi-rocket-takeoff-fill ms-2"></i>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}