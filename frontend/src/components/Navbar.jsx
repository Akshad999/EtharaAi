import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        <div className="nav-left">
          <span className="logo-text">Ethara<span className="accent">AI</span> Task</span>
        </div>
        
        <div className="nav-right">
          <button className="nav-icon-btn">
            <Bell size={20} />
          </button>
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          height: 70px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          border-radius: 0;
          border-top: none;
          border-left: none;
          border-right: none;
          display: flex;
          align-items: center;
        }
        .nav-container {
          width: 100%;
          padding: 0 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .accent {
          color: var(--primary);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-icon-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .nav-icon-btn:hover {
          background: var(--glass-bg);
          color: var(--text-main);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 12px;
          background: #ecfdf5;
          border-radius: 12px;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-info {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .user-role {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .logout-btn {
          background: transparent;
          border: none;
          color: var(--error);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
