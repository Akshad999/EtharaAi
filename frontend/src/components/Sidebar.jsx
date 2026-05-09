import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, Users } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar glass">
      <div className="sidebar-menu">
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={22} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FolderKanban size={22} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <CheckSquare size={22} />
          <span>My Tasks</span>
        </NavLink>
        <NavLink to="/team" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Users size={22} />
          <span>Team</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="sidebar-link">
          <Settings size={22} />
          <span>Settings</span>
        </NavLink>
      </div>

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: calc(100vh - 70px);
          position: fixed;
          top: 70px;
          left: 0;
          border-radius: 0;
          border-top: none;
          border-left: none;
          border-bottom: none;
          padding: 30px 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: var(--text-muted);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s;
          font-weight: 500;
        }
        .sidebar-link:hover {
          background: var(--glass-bg);
          color: var(--text-main);
        }
        .sidebar-link.active {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        .sidebar-footer {
          margin-bottom: 20px;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
