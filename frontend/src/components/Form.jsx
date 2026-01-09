import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Form({ onGenerate }) {
  const [formData, setFormData] = useState({ year: '', skills: '', companies: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        year: formData.year,
        skills: formData.skills.split(',').map(s => s.trim()),
        companies: formData.companies.split(',').map(c => c.trim())
      };
      const id = await onGenerate(userData);
      navigate(`/dashboard/${id}`);
    } catch (error) {
      alert('Error generating roadmap');
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h1>Career Roadmap Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Year:</label>
          <select value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required>
            <option value="">Select Year</option>
            <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
          </select>
        </div>
        <div>
          <label>Skills (comma separated):</label>
          <input type="text" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} placeholder="React, Python" required />
        </div>
        <div>
          <label>Target Companies (comma separated):</label>
          <input type="text" value={formData.companies} onChange={(e) => setFormData({...formData, companies: e.target.value})} placeholder="Google, Microsoft" required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Roadmap'}</button>
      </form>
    </div>
  );
}
