import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css'; // Import the CSS file

export default function Form({ onGenerate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    education: '',
    skills: [],
    customSkills: [],
    companies: [],
    customCompanies: [],
    interests: [],
    customInterests: []
  });
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Education', icon: 'fa-graduation-cap' },
    { number: 2, title: 'Skills', icon: 'fa-code' },
    { number: 3, title: 'Companies', icon: 'fa-building' },
    { number: 4, title: 'Interests', icon: 'fa-heart' }
  ];

  const educationOptions = [
    '1st Year BTech',
    '2nd Year BTech',
    '3rd Year BTech',
    '4th Year BTech',
    'Final Year MCA',
    'Recent Graduate'
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

  const handleNext = () => {
    if (currentStep === 1 && !formData.education) {
      alert('Please select your education level');
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
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
        interests: [...formData.interests, ...formData.customInterests]
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
      <div className="row">
        <div className="col-lg-10 col-xl-8 mx-auto">   
          {/* Stepper */}
          <div className="stepper">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="step-item">
                  <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <i className={`fas ${step.icon}`}></i>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`step-line ${isCompleted ? 'completed' : ''}`}></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center mb-4">
            <p className="text-muted">Step {currentStep} of 4: {steps[currentStep - 1].title}</p>
          </div>
          {/* Form Card */}
          <div className="form-card">
            
            {/* Step 1: Education */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-center fw-bold mb-3">What's your current education level?</h2>
                <p className="text-center text-muted mb-5">This helps us tailor the roadmap to your timeline</p> 
                <div className="row g-3 mb-5">
                  {educationOptions.map((option) => (
                    <div key={option} className="col-md-6">
                      <button
                        type="button"
                        onClick={() => handleEducationSelect(option)}
                        className={`option-btn ${formData.education === option ? 'selected' : ''}`}
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
                <h2 className="text-center fw-bold mb-3">What skills do you have?</h2>
                <p className="text-center text-muted mb-5">Select all that apply or add your own</p>
                <div className="mb-4 text-center">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSelection('skills', skill)}
                      className={`skill-badge ${formData.skills.includes(skill) ? 'selected' : ''}`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <div className="row g-2 mb-4">
                  <div className="col-9">
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
                      placeholder="Add custom skill..."
                      className="form-control custom-input"
                    />
                  </div>
                  <div className="col-3">
                    <button
                      type="button"
                      onClick={() => addCustomItem('skills')}
                      className="btn btn-outline-dark w-100 custom-input"
                    >
                    Add
                    </button>
                  </div>
                </div>
                {allSelected('skills').length > 0 && (
                  <div className="selected-box">
                    <p className="small fw-semibold text-muted mb-2">Selected:</p>
                    <div>
                      {allSelected('skills').map((skill, idx) => (
                        <span key={idx} className="selected-item">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Step 3: Companies */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-center fw-bold mb-3">Which companies are you targeting?</h2>
                <p className="text-center text-muted mb-5">We'll focus on skills these companies look for</p>
                <div className="mb-4 text-center">
                  {companyOptions.map((company) => (
                    <button
                      key={company}
                      type="button"
                      onClick={() => toggleSelection('companies', company)}
                      className={`skill-badge ${formData.companies.includes(company) ? 'selected' : ''}`}
                    >
                      {company}
                    </button>
                  ))}
                </div>
                <div className="row g-2 mb-4">
                  <div className="col-9">
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
                      placeholder="Add custom company..."
                      className="form-control custom-input"
                    />
                  </div>
                  <div className="col-3">
                    <button
                      type="button"
                      onClick={() => addCustomItem('companies')}
                      className="btn btn-outline-dark w-100 custom-input"
                    >
                      Add
                    </button>
                  </div>
                </div>
                {allSelected('companies').length > 0 && (
                  <div className="selected-box">
                    <p className="small fw-semibold text-muted mb-2">Selected:</p>
                    <div>
                      {allSelected('companies').map((company, idx) => (
                        <span key={idx} className="selected-item">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Interests */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-center fw-bold mb-3">What are your interests? (Optional)</h2>
                <p className="text-center text-muted mb-5">Help us personalize your learning path</p>
                
                <div className="mb-4 text-center">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleSelection('interests', interest)}
                      className={`skill-badge ${formData.interests.includes(interest) ? 'selected' : ''}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-9">
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
                      placeholder="Add custom interest..."
                      className="form-control custom-input"
                    />
                  </div>
                  <div className="col-3">
                    <button
                      type="button"
                      onClick={() => addCustomItem('interests')}
                      className="btn btn-outline-dark w-100 custom-input"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-5 pt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn btn-outline-dark px-4 py-2"
                style={{borderRadius: '12px', borderWidth: '2px'}}
              >
                <i className="fas fa-arrow-left me-2"></i>Back
              </button>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-dark px-4 py-2"
                  style={{borderRadius: '12px'}}
                >
                  Next<i className="fas fa-arrow-right ms-2"></i>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn btn-dark px-4 py-2"
                  style={{borderRadius: '12px'}}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Roadmap<i className="fas fa-arrow-right ms-2"></i>
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