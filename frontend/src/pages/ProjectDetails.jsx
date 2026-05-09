import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, UserPlus, CheckCircle2, Clock, ListTodo, MoreVertical } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  });
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      setProject(projRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/tasks`, taskData);
      setShowTaskModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      setShowMemberModal(false);
      setMemberEmail('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add member');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state">Loading details...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="project-details fade-in">
      <header className="details-header">
        <div className="header-info">
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>
        {user?.role === 'Admin' && (
          <div className="header-actions">
            <button className="btn btn-outline" onClick={() => setShowMemberModal(true)}>
              <UserPlus size={18} /> Invite
            </button>
            <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={18} /> Add Task
            </button>
          </div>
        )}
      </header>

      <div className="members-section">
        <h3>Team Members</h3>
        <div className="avatars-list">
          <div className="avatar admin" title={`Admin: ${project.admin.name}`}>
            {project.admin.name.charAt(0)}
          </div>
          {project.members.map(m => (
            <div key={m._id} className="avatar" title={m.name}>
              {m.name.charAt(0)}
            </div>
          ))}
        </div>
      </div>

      <div className="tasks-board">
        {['To Do', 'In Progress', 'Completed'].map(status => (
          <div key={status} className="board-column">
            <div className="column-header">
              <h3>{status}</h3>
              <span className="count">{tasks.filter(t => t.status === status).length}</span>
            </div>
            <div className="column-tasks">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="task-card-mini glass-card">
                  <div className="task-top">
                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <button className="more-btn"><MoreVertical size={16} /></button>
                  </div>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="task-bottom">
                    <div className="task-user" title={task.assignedTo?.name}>
                      {task.assignedTo?.name.charAt(0)}
                    </div>
                    <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div className="task-actions">
                    {status !== 'To Do' && (
                      <button onClick={() => updateTaskStatus(task._id, 'To Do')} className="status-btn">Move to To Do</button>
                    )}
                    {status !== 'In Progress' && (
                      <button onClick={() => updateTaskStatus(task._id, 'In Progress')} className="status-btn">Move to In Progress</button>
                    )}
                    {status !== 'Completed' && (
                      <button onClick={() => updateTaskStatus(task._id, 'Completed')} className="status-btn success">Complete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content fade-in">
            <h2>Add New Task</h2>
            <form onSubmit={handleTaskSubmit}>
              <div className="input-group">
                <label>Task Title</label>
                <input type="text" value={taskData.title} onChange={(e) => setTaskData({...taskData, title: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea value={taskData.description} onChange={(e) => setTaskData({...taskData, description: e.target.value})} required></textarea>
              </div>
              <div className="input-group">
                <label>Assign To (User ID)</label>
                <select value={taskData.assignedTo} onChange={(e) => setTaskData({...taskData, assignedTo: e.target.value})} required>
                  <option value="">Select Member</option>
                  <option value={project.admin._id}>{project.admin.name} (Admin)</option>
                  {project.members.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-row">
                <div className="input-group">
                    <label>Priority</label>
                    <select value={taskData.priority} onChange={(e) => setTaskData({...taskData, priority: e.target.value})}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Due Date</label>
                    <input type="date" value={taskData.dueDate} onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content fade-in">
            <h2>Invite Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="input-group">
                <label>Member Email</label>
                <input type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="colleague@company.com" required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .project-details { padding: 30px; }
        .details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .header-info h1 { font-size: 2.2rem; margin-bottom: 8px; }
        .header-info p { color: var(--text-muted); font-size: 1.1rem; }
        .header-actions { display: flex; gap: 12px; }
        
        .members-section { margin-bottom: 40px; }
        .members-section h3 { font-size: 1rem; color: var(--text-muted); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .avatars-list { display: flex; gap: 10px; }
        .avatar { width: 40px; height: 40px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary); font-size: 0.9rem; }
        .avatar.admin { border-color: var(--primary); box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }

        .tasks-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; min-height: 500px; }
        .board-column { background: rgba(255, 255, 255, 0.02); border-radius: 20px; padding: 20px; border: 1px solid var(--glass-border); }
        .column-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 5px; }
        .column-header h3 { font-size: 1.1rem; }
        .column-header .count { background: var(--glass-bg); padding: 2px 10px; border-radius: 20px; font-size: 0.8rem; color: var(--text-muted); }
        
        .column-tasks { display: flex; flex-direction: column; gap: 15px; }
        .task-card-mini { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .task-top { display: flex; justify-content: space-between; align-items: center; }
        .priority-tag { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 800; text-transform: uppercase; }
        .priority-tag.low { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .priority-tag.medium { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .priority-tag.high { background: rgba(239, 68, 68, 0.1); color: var(--error); }
        .more-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
        
        .task-card-mini h4 { font-size: 1rem; }
        .task-card-mini p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; }
        
        .task-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 5px; }
        .task-user { width: 28px; height: 28px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: white; font-weight: 700; }
        .task-date { font-size: 0.75rem; color: var(--text-muted); }
        
        .task-actions { display: flex; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--glass-border); flex-wrap: wrap; }
        .status-btn { background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-main); font-size: 0.7rem; padding: 4px 8px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
        .status-btn:hover { background: var(--primary); border-color: var(--primary); }
        .status-btn.success:hover { background: var(--success); border-color: var(--success); }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { width: 100%; max-width: 500px; padding: 40px; }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
