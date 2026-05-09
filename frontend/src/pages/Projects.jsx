import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      setShowModal(false);
      setFormData({ title: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state">Loading projects...</div>;

  return (
    <div className="projects-page fade-in">
      <header className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your team's project portfolios</p>
        </div>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Create Project
          </button>
        )}
      </header>

      <div className="projects-grid">
        {projects.length > 0 ? projects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id} className="project-card glass-card">
            <div className="project-icon">
              <Folder size={24} color="var(--primary)" />
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <div className="project-meta">
              <div className="meta-item">
                <Users size={16} />
                <span>{project.members?.length || 0} Members</span>
              </div>
              <ChevronRight size={20} className="arrow" />
            </div>
          </Link>
        )) : <div className="no-projects glass-card">No projects found.</div>}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content fade-in">
            <h2>Create New Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Project Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="E.g. Website Redesign"
                  required 
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Describe the project goal..."
                  rows="4"
                  required 
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .projects-page {
          padding: 30px;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }
        .project-card {
          padding: 24px;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .project-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
        }
        .project-icon {
          width: 48px;
          height: 48px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .project-info h3 {
          margin-bottom: 8px;
          font-size: 1.25rem;
        }
        .project-info p {
          color: var(--text-muted);
          font-size: 0.9rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .project-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--glass-border);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .arrow {
          color: var(--text-muted);
          transition: transform 0.2s;
        }
        .project-card:hover .arrow {
          transform: translateX(5px);
          color: var(--primary);
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 40px;
        }
        .modal-content h2 {
          margin-bottom: 24px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 30px;
        }
        .no-projects {
          grid-column: 1 / -1;
          padding: 60px;
          text-align: center;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Projects;
