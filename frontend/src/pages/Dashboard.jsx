import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/tasks');
        const allTasks = res.data.data;
        setTasks(allTasks);

        const now = new Date();
        const s = {
          total: allTasks.length,
          todo: allTasks.filter(t => t.status === 'To Do').length,
          inProgress: allTasks.filter(t => t.status === 'In Progress').length,
          completed: allTasks.filter(t => t.status === 'Completed').length,
          overdue: allTasks.filter(t => new Date(t.dueDate) < now && t.status !== 'Completed').length
        };
        setStats(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="dashboard-page fade-in">
      <header className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Track your team's progress and upcoming deadlines</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon todo"><ListTodo size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">To Do</span>
            <span className="stat-value">{stats.todo}</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon progress"><Clock size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats.inProgress}</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon completed"><CheckCircle2 size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon overdue"><AlertCircle size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Overdue</span>
            <span className="stat-value">{stats.overdue}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="glass-card recent-tasks">
          <h3>Recent Tasks</h3>
          <div className="task-list">
            {tasks.length > 0 ? tasks.slice(0, 5).map(task => (
              <div key={task._id} className="task-item">
                <div className="task-meta">
                  <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                    {task.status}
                  </span>
                  <span className="task-project">{task.project?.title}</span>
                </div>
                <h4>{task.title}</h4>
                <p className="task-desc">{task.description}</p>
                <div className="task-footer">
                   <span className="task-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            )) : <p className="no-data">No tasks found. Create a project to get started.</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          padding: 30px;
        }
        .page-header {
          margin-bottom: 30px;
        }
        .page-header h1 {
          font-size: 2rem;
          margin-bottom: 5px;
        }
        .page-header p {
          color: var(--text-muted);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon.todo { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
        .stat-icon.progress { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .stat-icon.completed { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .stat-icon.overdue { background: rgba(239, 68, 68, 0.1); color: var(--error); }
        
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .recent-tasks {
          padding: 30px;
        }
        .recent-tasks h3 {
          margin-bottom: 20px;
        }
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .task-item {
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
        }
        .task-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .status-badge {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-badge.to-do { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
        .status-badge.in-progress { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .status-badge.completed { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        
        .task-project {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .task-item h4 {
          margin-bottom: 5px;
        }
        .task-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .task-footer {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .no-data {
          text-align: center;
          color: var(--text-muted);
          padding: 40px 0;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
