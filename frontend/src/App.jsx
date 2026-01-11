import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import { roadmapApi } from './api/roadmaps';
//import './App.css';

function App() {
  const [roadmaps, setRoadmaps] = useState([]);

  const generateRoadmap = async (userData) => {
    const data = await roadmapApi.generate(userData);

    setRoadmaps(prev => [...prev, data]);  
    return data.id;
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Form onGenerate={generateRoadmap} />} />
          <Route
            path="/dashboard/:id"
            element={<Dashboard roadmaps={roadmaps} setRoadmaps={setRoadmaps} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
