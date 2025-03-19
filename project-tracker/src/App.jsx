import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [task, setTask] = useState('');
  const [activity, setActivity] = useState('');
  const [report, setReport] = useState('');

  const api = 'http://127.0.0.1:5000';

  // Fetch projects
  useEffect(() => {
    axios.get(`${api}/projects`).then((res) => setProjects(res.data));
  }, []);

  // Add project
  const handleAddProject = () => {
    if (!newProject) return;
    axios.post(`${api}/projects`, { name: newProject }).then(() => {
      setNewProject('');
      axios.get(`${api}/projects`).then((res) => setProjects(res.data));
    });
  };

  // Add task
  const handleAddTask = (id) => {
    if (!task) return;
    axios.post(`${api}/projects/${id}/tasks`, { task }).then(() => {
      setTask('');
      axios.get(`${api}/projects`).then((res) => setProjects(res.data));
    });
  };

  // Add activity
  const handleAddActivity = (id) => {
    if (!activity) return;
    axios.post(`${api}/projects/${id}/activities`, { description: activity }).then(() => {
      setActivity('');
      axios.get(`${api}/projects`).then((res) => setProjects(res.data));
    });
  };

  // Generate report
  const handleGenerateReport = () => {
    axios.get(`${api}/report`).then((res) => setReport(res.data.report));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mis Proyectos</h1>

      <input
        placeholder="Nuevo Proyecto"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
      />
      <button onClick={handleAddProject}>Agregar Proyecto</button>

      <hr />

      {projects.map((project) => (
        <div key={project.id} style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
          <h3>{project.name}</h3>

          <strong>Tareas Pendientes:</strong>
          <ul>
            {project.tasks.map((t, index) => (
              <li key={index}>{t}</li>
            ))}
          </ul>

          <input
            placeholder="Nueva Tarea"
            value={selectedProject === project.id ? task : ''}
            onChange={(e) => {
              setSelectedProject(project.id);
              setTask(e.target.value);
            }}
          />
          <button onClick={() => handleAddTask(project.id)}>Agregar Tarea</button>

          <br /><br />

          <strong>Actividades Realizadas:</strong>
          <ul>
            {project.activities.map((a, index) => (
              <li key={index}>{a.description} ({a.date})</li>
            ))}
          </ul>

          <input
            placeholder="Nueva Actividad"
            value={selectedProject === project.id ? activity : ''}
            onChange={(e) => {
              setSelectedProject(project.id);
              setActivity(e.target.value);
            }}
          />
          <button onClick={() => handleAddActivity(project.id)}>Agregar Actividad</button>
        </div>
      ))}

      <hr />
      <button onClick={handleGenerateReport}>Generar Reporte</button>
      {report && (
        <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#eee', padding: '10px', marginTop: '10px' }}>
          {report}
        </pre>
      )}
    </div>
  );
}

export default App;
