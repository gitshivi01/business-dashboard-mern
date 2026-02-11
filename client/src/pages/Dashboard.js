import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          Logout
        </button>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h2>Welcome, {user?.name}! 👋</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
        <p style={{ marginTop: '20px', color: '#6c757d' }}>
          Your business dashboard is coming soon...
        </p>
      </div>
    </div>
  );
}

export default Dashboard;